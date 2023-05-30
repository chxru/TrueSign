import { Router } from 'express';
import {
  CreateModule,
  GetModule,
  GetMyModules,
} from '../services/modules.service';

const router = Router();

router.get('/', GetMyModules);
router.get('/:id', GetModule);
router.post('/create', CreateModule);

export default router;
