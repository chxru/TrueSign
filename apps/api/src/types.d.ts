declare namespace Express {
  export interface Request {
    user: {
      id: string;
      roles: {
        staff: boolean;
        student: boolean;
        superAdmin: boolean;
      };
    } | null;
  }
}
