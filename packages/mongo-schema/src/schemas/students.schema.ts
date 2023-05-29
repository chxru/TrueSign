import { model, Schema } from 'mongoose';

interface IStudent {
  studentId: string;
  name: string;
  email: string;
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
  },
  {
    timestamps: true,
  }
);

export const StudentsModel = model('Students', studentsSchema);
