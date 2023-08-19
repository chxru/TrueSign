import { IBorders } from '@truesign/types';
import { model, Schema } from 'mongoose';

interface IRefSig {
  uniqueId: string;
  borders: IBorders;
  totalStudents: number;
  fileName: string;
}

const refSigSchema = new Schema<IRefSig>(
  {
    uniqueId: {
      type: String,
      required: true,
      index: true,
    },
    borders: {
      topLeft: {
        x: {
          type: Number,
        },
        y: {
          type: Number,
        },
      },
      topRight: {
        x: {
          type: Number,
        },
        y: {
          type: Number,
        },
      },
      bottomLeft: {
        x: {
          type: Number,
        },
        y: {
          type: Number,
        },
      },
      bottomRight: {
        x: {
          type: Number,
        },
        y: {
          type: Number,
        },
      },
    },
    totalStudents: {
      type: Number,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RefSigModel = model<IRefSig>('RefSig', refSigSchema);
