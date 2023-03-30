import { model, Schema } from 'mongoose';

export enum ImageStatus {
  Unprocessed,
  CornerDetected,
  CornerVerified,
}

const uploadedImageSchema = new Schema({
  filename: String,
  path: String,
  status: {
    type: Number,
    enum: ImageStatus,
  },
});

export const UploadedImageModel = model('UploadedImage', uploadedImageSchema);
