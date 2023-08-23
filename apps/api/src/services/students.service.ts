import { RefSigModel, StudentsModel } from '@truesign/mongo';
import {
  ExpressRequest,
  ExpressResponse,
  IBorders,
  ICreateStudentsReqBody,
  IStudent,
  IUploadStudentsReqBody,
} from '@truesign/types';
import { IStorageService, S3Service } from './storage';

export const CreateStudent = async (
  req: ExpressRequest<ICreateStudentsReqBody>,
  res: ExpressResponse
) => {
  // TODO: Do request validation
  const students = req.body.students;
  if (!Array.isArray(students)) {
    return res.status(400).send({ message: 'Invalid request body' });
  }

  try {
    await StudentsModel.insertMany(students, {
      ordered: false, // continue inserting even if there are duplicates
      throwOnValidationError: true,
    });
  } catch (error) {
    if (error.writeErrors && Array.isArray(error.writeErrors)) {
      const duplicates: string[] = [];

      for (const err of error.writeErrors) {
        const e = err.err;
        if (e.code === 11000 && e.op && e.op.studentId) {
          duplicates.push(e.op.studentId);
        }
      }

      return res.status(201).send({
        message: 'duplicates found',
        data: duplicates,
      });
    } else {
      return res.status(500).send({ message: 'Internal servicer error' });
    }
  }

  res.sendStatus(201);
};

export const HandleUpload = async (
  req: ExpressRequest<IUploadStudentsReqBody>,
  res: ExpressResponse
) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({
      message: 'No files were uploaded.',
    });
  }

  const images = req.files['images[]'];
  if (!Array.isArray(images)) {
    return res.status(400).send({
      message: 'Invalid request body, no images found',
    });
  }

  if (!Array.isArray(req.body['borders[]'])) {
    return res.status(400).send({
      message: 'Invalid request body, no borders found',
    });
  }

  const borders: IBorders[] = [];
  for (const border of req.body['borders[]']) {
    try {
      borders.push(JSON.parse(border));
    } catch (error) {
      return res.status(400).send({
        message: 'Invalid request body, invalid borders',
      });
    }
  }

  if (!Array.isArray(req.body['pageNo[]'])) {
    return res.status(400).send({
      message: 'Invalid request body, no pageNos found',
    });
  }

  const pageNos: number[] = [];
  for (const pageNo of req.body['pageNo[]']) {
    try {
      pageNos.push(parseInt(pageNo));
    } catch (error) {
      return res.status(400).send({
        message: 'Invalid request body, invalid pageNo',
      });
    }
  }

  if (!Array.isArray(req.body['students[]'])) {
    return res.status(400).send({
      message: 'Invalid request body, no students found',
    });
  }

  // timestamp act as a unique id in later steps
  const uniqueId = Date.now();

  const students: (IStudent & { importedIn: string })[] = [];
  for (const student of req.body['students[]']) {
    try {
      students.push({
        ...JSON.parse(student),
        importedIn: uniqueId.toString(),
      });
    } catch (error) {
      return res.status(400).send({
        message: 'Invalid request body, invalid students',
      });
    }
  }

  // validate images, borders and pageNo are same in length
  if (images.length !== borders.length || images.length !== pageNos.length) {
    return res.status(400).send({
      message: 'Invalid request body, invalid length',
    });
  }

  // upload signature images to S3
  try {
    const storageService: IStorageService = new S3Service();

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const border = borders[i];
      const pageNo = pageNos[i];

      const extension = image.name.split('.').pop();
      const fileName = await storageService.upload({
        data: image.data,
        directory: `uploads/reference_sign_sheets/${uniqueId}/`,
        extension,
        filename: `${pageNo}`,
      });

      await RefSigModel.create({
        uniqueId,
        border,
        totalStudents: students.length,
        fileName,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: 'Internal server error while uploading images',
    });
  }

  try {
    // add students to database
    await StudentsModel.insertMany(students, {
      ordered: false, // continue inserting even if there are duplicates
      throwOnValidationError: true, // throw error if validation fails
    });
  } catch (error) {
    if (error.writeErrors && Array.isArray(error.writeErrors)) {
      const duplicates: string[] = [];

      for (const err of error.writeErrors) {
        const e = err.err;
        if (e.code === 11000 && e.op && e.op.studentId) {
          duplicates.push(e.op.studentId);
        }
      }

      return res.status(201).send({
        message: 'duplicates found',
        data: duplicates,
      });
    } else {
      return res.status(500).send({ message: 'Internal servicer error' });
    }
  }

  res.sendStatus(200);
};
