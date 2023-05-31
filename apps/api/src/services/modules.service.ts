import { ModuleModel, StudentsModel } from '@truesign/mongo';
import {
  ExpressRequest,
  ExpressResponse,
  IAddStudentsToModuleReq,
  IAddStudentsToModuleRes,
  ICreateModuleReq,
  IGetModulesRes,
} from '@truesign/types';

const sortStudentIds = (ids: string[]) => {
  // id has the format of {faculty}/{year}/{number}
  // sort by faculty, then year, then number
  return ids.sort((a, b) => {
    const [aFaculty, aYear, aNumber] = a.split('/');
    const [bFaculty, bYear, bNumber] = b.split('/');

    if (aFaculty < bFaculty) {
      return -1;
    } else if (aFaculty > bFaculty) {
      return 1;
    } else {
      if (aYear < bYear) {
        return -1;
      } else if (aYear > bYear) {
        return 1;
      } else {
        if (aNumber < bNumber) {
          return -1;
        } else if (aNumber > bNumber) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  });
};

export const CreateModule = async (
  req: ExpressRequest<ICreateModuleReq>,
  res: ExpressResponse
) => {
  // validate request has a user
  if (!req.user) {
    return res.sendStatus(401);
  }

  // validate permissions
  if (!req.user.roles.staff) {
    return res.sendStatus(403);
  }

  // validate request body
  if (!req.body.name || !req.body.moduleId) {
    return res.sendStatus(400);
  }

  // create module
  const module = new ModuleModel({
    name: req.body.name,
    moduleId: req.body.moduleId.toLowerCase(),
    coordinator: req.user.mongoId,
  });

  try {
    await module.save();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ message: error.message });
    } else {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }

    return;
  }

  res.sendStatus(201);
};

export const GetMyModules = async (
  req: ExpressRequest,
  res: ExpressResponse<IGetModulesRes>
) => {
  // validate request has a user
  if (!req.user) {
    return res.sendStatus(401);
  }

  // get modules
  const modules = await ModuleModel.find({
    coordinator: req.user.mongoId,
  }).populate('students', 'studentId');

  const result: IGetModulesRes = {
    modules: [],
  };

  for (const module of modules) {
    const ids = (module.students as unknown as { studentId: string }[]).map(
      (s) => s.studentId
    );

    result.modules.push({
      id: module._id.toString(),
      moduleId: module.moduleId,
      name: module.name,
      coordinator: module.coordinator.toString(),
      studentIds: sortStudentIds(ids),
    });
  }

  res.send(result);
};

export const GetModule = async (
  req: ExpressRequest,
  res: ExpressResponse<IGetModulesRes>
) => {
  // validate request has a user
  if (!req.user) {
    return res.sendStatus(401);
  }

  // get module
  const module = await ModuleModel.findOne({
    moduleId: req.params.id.toLowerCase(),
  }).populate('students', 'studentId');

  if (!module) {
    return res.sendStatus(404);
  }

  const ids = (module.students as unknown as { studentId: string }[]).map(
    (s) => s.studentId
  );

  res.send({
    modules: [
      {
        id: module._id.toString(),
        moduleId: module.moduleId,
        name: module.name,
        coordinator: module.coordinator.toString(),
        studentIds: sortStudentIds(ids),
      },
    ],
  });
};

export const AddStudentsToModule = async (
  req: ExpressRequest<IAddStudentsToModuleReq>,
  res: ExpressResponse<IAddStudentsToModuleRes>
) => {
  if (!req.params.id) {
    return res
      .status(400)
      .send({ message: 'ID parameter is missing', data: [] });
  }

  if (
    !req.body.students ||
    (req.body.students && !Array.isArray(req.body.students))
  ) {
    return res.status(400).send({ message: 'Invalid request body', data: [] });
  }

  try {
    const studentIds = req.body.students.map((s) => s.toLowerCase());

    // extract student internal ids from database for given student ids
    const students = await StudentsModel.find({
      studentId: { $in: studentIds },
    }).select({
      _id: 1,
      studentId: 1,
    });

    // if req.body.students.length !== students.length, then some students were not found
    // filter them out, insert the rest
    const missingStudentIds: string[] = [];
    if (students.length !== studentIds.length) {
      const foundStudentIds = students.map((s) => s.studentId.toLowerCase());
      studentIds.forEach((s) => {
        if (!foundStudentIds.includes(s)) {
          missingStudentIds.push(s);
        }
      });
    }

    // insert students into module
    await ModuleModel.updateOne(
      { moduleId: req.params.id.toLowerCase() },
      {
        $addToSet: {
          students: students.map((s) => s._id),
        },
      }
    );

    // insert module into students
    const moduleId = await ModuleModel.findOne({
      moduleId: req.params.id.toLowerCase(),
    }).select({
      _id: 1,
    });

    await StudentsModel.updateMany(
      { studentId: { $in: studentIds } },
      {
        $addToSet: {
          modules: moduleId?._id,
        },
      }
    );

    // return missing student ids
    if (missingStudentIds.length > 0) {
      return res.status(200).send({
        message: "Some students weren't found",
        data: missingStudentIds,
      });
    } else {
      return res.sendStatus(200);
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).send({ message: error.message, data: [] });
    } else {
      return res
        .status(500)
        .send({ message: 'Internal Server Error', data: [] });
    }
  }
};
