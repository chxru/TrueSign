interface Student {
  studentId: string;
  name: string;
  email: string;
}

export interface ICreateStudentsReqBody {
  students: Student[];
}

export type ICreateStudentRes =
  | {
      message: string;
      data: string[];
    }
  | string;
