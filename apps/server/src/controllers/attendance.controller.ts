import { Router } from 'express';
import {
  AddImagesToAttendance,
  GetMyAttendances,
  StartAttendance,
} from '../services/attendance.service';

const router = Router();

router.get('/my', GetMyAttendances);
router.post('/start', StartAttendance);
router.post('/:sessionId/upload', AddImagesToAttendance);

export default router;
