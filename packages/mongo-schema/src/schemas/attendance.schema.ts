import { IBorders } from '@truesign/types';
import { model, Schema, Types } from 'mongoose';

interface IAttendance {
  moduleId: Types.ObjectId;
  date: Date;
  originalImages: Map<
    string,
    {
      page: number;
      path: string;
      borders: IBorders;
    }
  >;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: 'Modules',
      index: true,
    },
    date: {
      type: Date,
    },
    originalImages: {
      type: Map,
      of: {
        page: {
          type: Number,
        },
        path: {
          type: String,
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
      },
    },
  },
  {
    timestamps: true,
  }
);

export const AttendanceModel = model('Attendance', attendanceSchema);
