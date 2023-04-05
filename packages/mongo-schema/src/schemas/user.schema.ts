import { model, Schema } from 'mongoose';

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  isStudent: boolean;
  isStaff: boolean;
}

const userSchema = new Schema<IUser>(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      index: true,
      unique: true,
    },
    isStudent: Boolean,
    isStaff: Boolean,
  },
  {
    timestamps: true,
  }
);

export const UserModel = model('User', userSchema);
