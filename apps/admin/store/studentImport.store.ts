import { IStudent } from '@truesign/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Status =
  | 'imported'
  | 'import-failed'
  | 'ref-sign-added'
  | 'ref-sign-failed';

interface IStudentWithState extends IStudent {
  status: Status;
}

type State = {
  students: IStudentWithState[];
};

type Actions = {
  importStudents: (students: IStudentWithState[]) => void;
  updateStudentState: (studentId: string, status: Status) => void;
};

interface IStudentImportStore extends State, Actions {}

export const useStudentImportStore = create<IStudentImportStore>()(
  devtools((set) => ({
    students: [],
    importStudents: (students) => {
      set({ students });
    },
    updateStudentState: (studentId, status) => {
      set((state) => {
        const studentIndex = state.students.findIndex(
          (student) => student.studentId === studentId
        );
        if (studentIndex === -1) return state;
        const updatedStudent = {
          ...state.students[studentIndex],
          status,
        };
        const updatedStudents = [...state.students];
        updatedStudents[studentIndex] = updatedStudent;
        return { students: updatedStudents };
      });
    },
  }))
);
