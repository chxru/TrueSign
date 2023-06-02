export interface IInitiateAttendanceReq {
  moduleId: string;
  date: number;
}

export interface IInitiateAttendanceRes {
  sessionId: string;
}
