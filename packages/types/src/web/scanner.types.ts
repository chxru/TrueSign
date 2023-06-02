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
