import { ImageStatus, UploadedImageModel } from '@truesign/mongo';
import { Router } from 'express';
import { IStorageService, MinioService } from '../services';

const router = Router();

router.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  if (Array.isArray(req.files.image)) {
    return res.status(400).send('Multiple files are not allowed.');
  }

  try {
    const storageService: IStorageService = new MinioService();

    const doc = new UploadedImageModel({
      filename: req.files.image.name,
      path: `upload/${req.files.image.name}`,
      status: ImageStatus.Unprocessed,
    });

    await doc.save();

    const extension = req.files.image.name.split('.').pop();
    await storageService.upload({
      data: req.files.image.data,
      directory: 'upload',
      extension,
      filename: doc._id.toString() + '.' + extension,
    });

    res.sendStatus(200);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('Internal Server Error while uploading');
    }
  }
});

export default router;
