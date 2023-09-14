import { Router } from 'express';
import { CreateInvite } from '../services/invite.service';

const router = Router();

router.post('/create', CreateInvite);

export default router;
