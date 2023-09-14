import { ExpressRequest } from '@truesign/types';
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';
import { Types } from 'mongoose';
import { SyncClerkFromDB } from '../services/clerk/clerk.service';

// only few are mentioned here
interface CustomJWTPayload extends JWTPayload {
  clerk_id: string;
  // can be null on first login
  internal_id: string | null;
  metadata: {
    isStaff: boolean;
    isStudent: boolean;
    isSuperAdmin: boolean;
  };
}

const JWKS = createRemoteJWKSet(new URL(process.env['CLERK_JWKS_ENDPOINT']));

export const ClerkJWTValidator = async (req: ExpressRequest, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    // DEMO ONLY
    if (token.startsWith('demo_key')) {
      const userId = token.split('-')[1];

      req.user = {
        id: userId,
        mongoId: new Types.ObjectId(userId),
        roles: {
          staff: true,
          student: true,
          superAdmin: true,
        },
      };

      return next();
    }

    const { payload: p } = await jwtVerify(token, JWKS, {
      issuer: process.env['CLERK_JWT_ISSUER'],
    });
    const payload = p as CustomJWTPayload;

    // on user first login, the internal_id is missing
    // therefore, instead of running a webhook, we assigning it here :)
    if (!payload.internal_id) {
      console.log(`User ${payload.clerk_id} do not have a internal id`);
      await SyncClerkFromDB(payload.clerk_id);
    }

    req.user = {
      id: payload.internal_id,
      mongoId: new Types.ObjectId(payload.internal_id),
      roles: {
        staff: payload.metadata.isStaff,
        student: payload.metadata.isStudent,
        superAdmin: payload.metadata.isSuperAdmin,
      },
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
