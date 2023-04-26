import { Request, Router } from 'express';

import SancionRouter from './Sanciones';
import UsersRouter from './Users';
import apiKeyMW from '@middleware/apiKeyHeaderValidator';

const router = Router();

// http://localhost:3001/cashflow/byindex/1
router.use('/sanciones', apiKeyMW, SancionRouter);
router.use('/security', apiKeyMW, UsersRouter);

export default router;

export interface WithUserRequest extends Request {
  user?: any;
}
