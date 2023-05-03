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

  const borders: IBorders = {
    topLeft: {
      x: approx.data32S[0],
      y: approx.data32S[1],
    },
    topRight: {
      x: approx.data32S[2],
      y: approx.data32S[3],
    },
    bottomLeft: {
      x: approx.data32S[4],
      y: approx.data32S[5],
    },
    bottomRight: {
      x: approx.data32S[6],
      y: approx.data32S[7],
    },
  };

  cv.imshow('selected-image', src);

  src.delete();
  dst.delete();
  M.delete();
  hierarchy.delete();
  contours.delete();
  approx.delete();
  // approxScaled.delete();

  return borders;
};
