import { Router } from 'express';
import { AuthController } from '../controller';
import { asyncHandler } from '../utilities';

const router = Router();

router
  .route('/login')
  .post(asyncHandler(AuthController.login))

router
  .route('/register')
  .post(asyncHandler(AuthController.register))

export = router;