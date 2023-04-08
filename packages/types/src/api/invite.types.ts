export interface ICreateInviteReqBody {
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'staff';
}

export interface ICreateInviteRes {
  inviteId: string;
}
