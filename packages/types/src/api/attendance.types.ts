export interface IInitiateAttendanceReq {
  moduleId: string;
  date: number;
}

export interface IInitiateAttendanceRes {
  sessionId: string;
}

export interface IMyModulesAttendanceRes {
  data: {
    _id: string;
    moduleId: string;
    name: string;
    attendances: {
      _id: string;
      date: string;
      createdAt: string;
    }[];
  }[];
}
