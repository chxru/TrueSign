import { ModuleModel } from '@truesign/mongo';
import {
  ExpressRequest,
  ExpressResponse,
  ICreateModuleReq,
} from '@truesign/types';

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
  res: ExpressResponse
) => {
  // validate request has a user
  if (!req.user) {
    return res.sendStatus(401);
  }

  // get modules
  const modules = await ModuleModel.find({
    coordinator: req.user.mongoId,
  });

  res.send(modules);
};

export const GetModule = async (req: ExpressRequest, res: ExpressResponse) => {
  // validate request has a user
  if (!req.user) {
    return res.sendStatus(401);
  }

  // get module
  const module = await ModuleModel.findOne({
    moduleId: req.params.id.toLowerCase(),
  });

  if (!module) {
    return res.sendStatus(404);
  }

  res.send(module);
};
