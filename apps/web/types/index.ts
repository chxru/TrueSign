import { IBorders } from '@truesign/types';

export type coordinates = {
  x: number;
  y: number;
};

export interface IUploadFile {
  id?: number;
  url: string;
  name: string;
  border: IBorders;
  processed: boolean;
  file: File;
}
