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
  }[];
}
