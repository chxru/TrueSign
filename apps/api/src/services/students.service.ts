import { StudentsModel } from '@truesign/mongo';
import {
  ExpressRequest,
  ExpressResponse,
  ICreateStudentsReqBody,
} from '@truesign/types';

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
      ordered: false,
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
