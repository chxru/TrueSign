import cv from 'opencv-ts';
import { IBorders } from '../types';

export const detectCorners = (): IBorders => {
  const src = cv.imread('selected-image');
  const dst = new cv.Mat();

  // resize image
  const rescaleSize = 500;
  const dSize = new cv.Size(rescaleSize, rescaleSize);
  cv.resize(src, dst, dSize, 0, 0, cv.INTER_AREA);

  // convert to grayscale
  cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 0);

  // gaussian blur
  const kSize = new cv.Size(5, 5);
  cv.GaussianBlur(src, dst, kSize, 0, 0, cv.BORDER_DEFAULT);

  // canny edge detection
  cv.Canny(src, dst, 50, 100);

  // dilate
  const M = new cv.Mat.ones(5, 5, cv.CV_8U);
  const anchor = new cv.Point(-1, -1);
  cv.dilate(
    dst,
    dst,
    M,
    anchor,
    1,
    cv.BORDER_CONSTANT,
    cv.morphologyDefaultBorderValue()
  );

  // erode
  cv.erode(
    dst,
    dst,
    M,
    anchor,
    1,
    cv.BORDER_CONSTANT,
    cv.morphologyDefaultBorderValue()
  );

  // find contours
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(
    dst,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  );

  // get max area contour
  let maxArea = 0;
  let maxAreaIdx = 0;
  for (let i = 0; i < contours.size(); i++) {
    const cnt = contours.get(i);
    const area = cv.contourArea(cnt, false);
    if (area > maxArea) {
      maxArea = area;
      maxAreaIdx = i;
    }
  }

  // get corners of the max area contour
  const cnt = contours.get(maxAreaIdx);
  const approx = new cv.Mat();
  cv.approxPolyDP(cnt, approx, 0.02 * cv.arcLength(cnt, true), true);

  // skip if not rectangle
  if (approx.rows !== 4) {
    src.delete();
    dst.delete();
    M.delete();
    contours.delete();
    hierarchy.delete();
    approx.delete();

    return {
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
    };
  }

  // draw points on src image
  const color = new cv.Scalar(0, 255, 0);
  for (let i = 0; i < approx.rows; i++) {
    const x = approx.data32S[i * 2];
    const y = approx.data32S[i * 2 + 1];
    cv.circle(src, new cv.Point(x, y), 3, color, 2);
  }

  const corner1 = {
    x: approx.data32S[0],
    y: approx.data32S[1],
  };

  const corner2 = {
    x: approx.data32S[2],
    y: approx.data32S[3],
  };

  const corner3 = {
    x: approx.data32S[4],
    y: approx.data32S[5],
  };

  const corner4 = {
    x: approx.data32S[6],
    y: approx.data32S[7],
  };

  const tempBorders = {};

  // sort corners
  if (corner1.x < corner2.x) {
    if (corner1.y < corner2.y) {
      tempBorders['topLeft'] = corner1;
      tempBorders['topRight'] = corner2;
    } else {
      tempBorders['bottomLeft'] = corner1;
      tempBorders['bottomRight'] = corner2;
    }
  } else {
    if (corner1.y < corner2.y) {
      tempBorders['topLeft'] = corner2;
      tempBorders['topRight'] = corner1;
    } else {
      tempBorders['bottomLeft'] = corner2;
      tempBorders['bottomRight'] = corner1;
    }
  }

  if (corner3.x < corner4.x) {
    if (corner3.y < corner4.y) {
      tempBorders['topLeft'] = corner3;
      tempBorders['topRight'] = corner4;
    } else {
      tempBorders['bottomLeft'] = corner3;
      tempBorders['bottomRight'] = corner4;
    }
  } else {
    if (corner3.y < corner4.y) {
      tempBorders['topLeft'] = corner4;
      tempBorders['topRight'] = corner3;
    } else {
      tempBorders['bottomLeft'] = corner4;
      tempBorders['bottomRight'] = corner3;
    }
  }

  cv.imshow('selected-image', src);

  src.delete();
  dst.delete();
  M.delete();
  hierarchy.delete();
  contours.delete();
  approx.delete();

  // make the borders position independent of the canvas size by
  // making width and height vary between 0-1
  const canvas = document.getElementById('selected-image') as HTMLCanvasElement;
  const width = canvas.width;
  const height = canvas.height;

  const borders: IBorders = {
    topLeft: {
      x: tempBorders['topLeft'].x / width,
      y: tempBorders['topLeft'].y / height,
    },
    topRight: {
      x: tempBorders['topRight'].x / width,
      y: tempBorders['topRight'].y / height,
    },
    bottomLeft: {
      x: tempBorders['bottomLeft'].x / width,
      y: tempBorders['bottomLeft'].y / height,
    },
    bottomRight: {
      x: tempBorders['bottomRight'].x / width,
      y: tempBorders['bottomRight'].y / height,
    },
  };

  return borders;
};
