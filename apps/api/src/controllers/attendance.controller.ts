import { Router } from 'express';
import {
  AddImagesToAttendance,
  StartAttendance,
} from '../services/attendance.service';

const router = Router();

router.post('/start', StartAttendance);
router.post('/:sessionId/upload', AddImagesToAttendance);

export default router;
