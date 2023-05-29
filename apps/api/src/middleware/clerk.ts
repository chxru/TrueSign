import { ExpressRequest } from '@truesign/types';
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

// only few are mentioned here
interface CustomJWTPayload extends JWTPayload {
  clerk_id: string;
  internal_id: string;
  metadata: {
    isStaff: boolean;
    isStudent: boolean;
    isSuperAdmin: boolean;
  };
}

const JWKS = createRemoteJWKSet(new URL(process.env['CLERK_JWKS_ENDPOINT']));

export const ClerkJWTValidator = async (req: ExpressRequest, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      res.status(401).send({ message: 'Unauthorized' });
    }

    const { payload: p } = await jwtVerify(token, JWKS, {
      issuer: process.env['CLERK_JWT_ISSUER'],
    });
    const payload = p as CustomJWTPayload;

    req.user = {
      id: payload.internal_id,
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
