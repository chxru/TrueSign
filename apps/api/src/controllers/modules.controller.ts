import { Router } from 'express';
import {
  AddStudentsToModule,
  CreateModule,
  GetModule,
  GetMyModules,
} from '../services/modules.service';

const router = Router();

router.get('/', GetMyModules);
router.get('/:id', GetModule);
router.post('/create', CreateModule);
router.post('/:id/students', AddStudentsToModule);

export default router;
