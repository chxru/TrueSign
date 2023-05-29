import { Router } from 'express';
import { CreateStudent } from '../services/students.service';

const router = Router();

router.post('/create', CreateStudent);

export default router;
