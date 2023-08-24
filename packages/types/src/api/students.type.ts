import { coordinates } from '..';

export interface IStudent {
  studentId: string;
  name: string;
  email: string;
}

export interface ICreateStudentsReqBody {
  students: IStudent[];
}

export type ICreateStudentRes =
  | {
      message: string;
      data: string[];
    }
  | string;

export interface IUploadStudentsReqBody {
  students: IStudent[];
  border: {
    topLeft: coordinates;
    topRight: coordinates;
    bottomLeft: coordinates;
    bottomRight: coordinates;
  };
  pageNo: string;
}
