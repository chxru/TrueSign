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
