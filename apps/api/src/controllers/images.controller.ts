import { Router } from 'express';
import { s3 } from '../services/s3.service';

const router = Router();

router.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  if (Array.isArray(req.files.image)) {
    return res.status(400).send('Multiple files are not allowed.');
  }

  try {
    await s3.uploadFile('upload', req.files.image.data);

    res.sendStatus(200);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('Internal Server Error while uploading s3');
    }
  }
});

export default router;
