import { model, Schema, Types } from 'mongoose';

interface IModule {
  moduleId: string;
  name: string;
  coordinator: Types.ObjectId;
  students: Types.ObjectId[];
}

const moduleSchema = new Schema<IModule>(
  {
    moduleId: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    coordinator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const ModuleModel = model('Module', moduleSchema);
