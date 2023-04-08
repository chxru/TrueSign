import { InvitesModel, UserModel } from '@truesign/mongo';
import {
  ExpressRequest,
  ExpressResponse,
  ICreateInviteReqBody,
  ICreateInviteRes,
} from '@truesign/types';
import { startSession } from 'mongoose';
import { CreateInviteLink } from './clerk/clerk.service';

export const CreateInvite = async (
  req: ExpressRequest<ICreateInviteReqBody>,
  res: ExpressResponse<ICreateInviteRes>
) => {
  // TODO: Do request validation

  // start mongoose transaction
  const session = await startSession();
  session.startTransaction();

  try {
    const user = await new UserModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      isStudent: req.body.role === 'student',
      isStaff: req.body.role === 'staff',
    }).save({ session });

    const inviteId = await CreateInviteLink({
      email: req.body.email,
      metadata: {
        isStudent: req.body.role === 'student',
        isStaff: req.body.role === 'staff',
      },
    });

    await new InvitesModel({
      userId: user._id,
      inviteId,
      externalId: inviteId,
    }).save({ session });

    await session.commitTransaction();

    res.status(201).send({
      inviteId,
    });
  } catch (error) {
    console.log('Error occurred while creating invite: ');

    await session.abortTransaction();
    if (error instanceof Error) {
      return res.status(400).send({ error: error.message });
    }

    return res.status(400).send({ error: 'Something went wrong' });
  } finally {
    session.endSession();
  }
};
