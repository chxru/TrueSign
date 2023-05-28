export type coordinates = {
  x: number;
  y: number;
};

export interface IBorders {
  topLeft: coordinates;
  topRight: coordinates;
  bottomLeft: coordinates;
  bottomRight: coordinates;
}

export interface IUploadFile {
  id?: number;
  url: string;
  name: string;
  border: IBorders;
  processed: boolean;
  file: File;
}
