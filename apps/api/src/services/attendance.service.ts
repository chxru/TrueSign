import { AttendanceModel, ModuleModel } from '@truesign/mongo';
import {
  ExpressRequest,
  ExpressResponse,
  IBorders,
  IInitiateAttendanceReq,
  IInitiateAttendanceRes,
} from '@truesign/types';
import { IStorageService, S3Service } from './storage';

export const StartAttendance = async (
  req: ExpressRequest<IInitiateAttendanceReq>,
  res: ExpressResponse<IInitiateAttendanceRes>
) => {
  if (!req.body.moduleId || !req.body.date) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  const date = new Date(req.body.date);

  // reject if it is future
  if (date > new Date()) {
    return res.status(400).send({ error: 'Date cannot be in future' });
  }

  try {
    const module = await ModuleModel.findOne({
      moduleId: req.body.moduleId,
    });

    const attendance = await new AttendanceModel({
      moduleId: module._id,
      date: date,
      originalImages: [],
    }).save();

    res.status(201).send({
      sessionId: attendance._id.toString(),
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
};

// everything is string cause it is coming from form data
interface AddImageReqFormDataType {
  borders: string;
  pageNo: string;
}

export const AddImagesToAttendance = async (
  req: ExpressRequest<AddImageReqFormDataType>,
  res: ExpressResponse
) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  if (Array.isArray(req.files.image)) {
    return res.status(400).send('Multiple files are not allowed.');
  }

  try {
    const borders = JSON.parse(req.body.borders) as IBorders;
    const page = parseInt(req.body.pageNo);

    const storageService: IStorageService = new S3Service();

    const extension = req.files.image.name.split('.').pop();
    const fileName = await storageService.upload({
      data: req.files.image.data,
      directory: `uploads/attendance/${req.params.sessionId}`,
      extension,
    });

    const attendance = await AttendanceModel.findById(
      req.params.sessionId
    ).exec();

    if (!attendance) {
      return res.status(404).send({ error: 'Attendance not found' });
    }

    attendance.originalImages.push({
      page,
      borders,
      path: fileName,
    });

    await attendance.save();

    res.sendStatus(200);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('Internal Server Error while uploading');
    }
  }
};
