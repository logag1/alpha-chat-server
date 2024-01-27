import { Router } from 'express';
import { TalkController } from '../controller';
import { asyncHandler } from '../utilities';
import { authenticateToken } from '../middleware'

const router = Router();

router
  .route('/notice')
  .get(asyncHandler(TalkController.getNotice))

router
  .route('/my')
  .get(authenticateToken, asyncHandler(TalkController.getMyInfo))

router
  .route('/friends')
  .get(authenticateToken, asyncHandler(TalkController.getFriends))

router
  .route('/friends/add')
  .post(authenticateToken, asyncHandler(TalkController.addFriend))

router
  .route('/friends/:userId')
  .get(authenticateToken, asyncHandler(TalkController.getInfo))

export = router;