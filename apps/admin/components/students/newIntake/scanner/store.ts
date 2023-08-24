import { IBorders } from '@truesign/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface IScannerUploadImage {
  id: number;
  url: string;
  name: string;
  processed: boolean;
  file: File;
}

interface DashboardState {
  counter: number;
  images: IScannerUploadImage[];
  borders: {
    id: number;
    borders: IBorders;
  }[];
  selectedImageId: number | null;
  addImage: (img: Omit<IScannerUploadImage, 'id'>) => void;
  updateBorders: (id: number, borders: IBorders) => void;
  selectImageById: (id: number) => void;
}

export const useScannerStore = create<DashboardState>()(
  devtools(
    (set) => ({
      counter: 0,
      images: [],
      borders: [],
      selectedImageId: undefined,
      addImage: (img: Omit<IScannerUploadImage, 'id'>) => {
        set((state) => ({
          images: [...state.images, { ...img, id: state.counter }],
          selectedImageId: state.selectedImageId || state.counter,
          counter: state.counter + 1,
          borders: [
            ...state.borders,
            {
              id: state.counter,
              borders: {
                topLeft: {
                  x: 0,
                  y: 0,
                },
                topRight: {
                  x: 0,
                  y: 0,
                },
                bottomLeft: {
                  x: 0,
                  y: 0,
                },
                bottomRight: {
                  x: 0,
                  y: 0,
                },
              },
            },
          ],
        }));
      },
      updateBorders: (id: number, borders: IBorders) => {
        set((state) => ({
          borders: state.borders.map((border) => {
            if (border.id === id) {
              return {
                id,
                borders,
              };
            }
            return border;
          }),
          images: state.images.map((image) => {
            if (image.id === id) {
              return {
                ...image,
                processed: true,
              };
            }
            return image;
          }),
        }));
      },
      selectImageById: (id: number) => {
        set(() => ({
          selectedImageId: id,
        }));
      },
    }),
    {
      name: 'dashboard-state',
      trace: true,
    }
  )
);
