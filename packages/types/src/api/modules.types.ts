export interface ICreateModuleReq {
  name: string;
  moduleId: string;
}

export interface IGetModulesRes {
  modules: {
    id: string;
    moduleId: string;
    name: string;
    coordinator: string;
    studentIds: string[];
  }[];
}

export interface IAddStudentsToModuleReq {
  students: string[];
}

export type IAddStudentsToModuleRes =
  | {
      message: string;
      data: string[];
    }
  | string;
