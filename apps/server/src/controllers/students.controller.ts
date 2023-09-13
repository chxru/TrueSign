import { Router } from 'express';
import { CreateStudent, HandleUpload } from '../services/students.service';

const router = Router();

router.post('/create', CreateStudent);
router.post('/upload', HandleUpload);

export default router;
