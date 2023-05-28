import { coordinates } from '@truesign/types';
import Draggable, { DraggableData } from 'react-draggable';

export interface PointerProps {
  position: coordinates;
  onDragEnd: (x: number, y: number) => void;
}

export const Pointer = ({ position, onDragEnd }: PointerProps) => {
  const onDrag = (data: DraggableData) => {
    const x = data.x;
    const y = data.y;

    onDragEnd(x, y);
  };

  return (
    <Draggable
      bounds="parent"
      defaultPosition={{ x: 0, y: 0 }}
      position={{ x: position.x, y: position.y }}
      onStop={(e, data) => {
        onDrag(data);
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '10px',
          height: '10px',
          backgroundColor: '#DF2E38',
          borderRadius: '50px',
        }}
      />
    </Draggable>
  );
};
