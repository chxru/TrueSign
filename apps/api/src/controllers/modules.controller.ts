import { Router } from 'express';
import { CreateModule } from '../services/modules.service';

const router = Router();

router.get('/:id');
router.get('/my');
router.post('/create', CreateModule);

export default router;
