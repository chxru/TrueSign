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
}

export interface DashboardState {
  counter: number;
  images: Omit<IUploadFile, 'border'>[];
  borders: {
    id: number;
    borders: IBorders;
  }[];
  selectedImageId: number | null;
  addImage: (img: Omit<IUploadFile, 'border'>) => void;
  updateBorders: (id: number, borders: IBorders) => void;
  selectImageById: (id: number) => void;
}
