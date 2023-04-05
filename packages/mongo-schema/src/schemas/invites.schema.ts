import { model, Schema } from 'mongoose';

interface IInvite {
  userId: Schema.Types.ObjectId;
  isUsed: boolean;
  externalId: string;
}

const invitesSchema = new Schema<IInvite>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    externalId: String,
  },
  {
    timestamps: true,
  }
);

export const InvitesModel = model('Invites', invitesSchema);
