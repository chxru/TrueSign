import { model, Schema, Types } from 'mongoose';

interface IStudent {
  studentId: string;
  name: string;
  email: string;
  modules: Types.ObjectId[];
  importedIn: string;
}

const studentsSchema = new Schema<IStudent>(
  {
    studentId: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    modules: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Module',
      },
    ],
    importedIn: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const StudentsModel = model('Students', studentsSchema);
