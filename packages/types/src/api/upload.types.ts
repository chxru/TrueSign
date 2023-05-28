import { coordinates } from '..';

export interface IUploadFile {
  url: string;
  name: string;
  border: {
    topLeft: coordinates;
    topRight: coordinates;
    bottomLeft: coordinates;
    bottomRight: coordinates;
  };
}
