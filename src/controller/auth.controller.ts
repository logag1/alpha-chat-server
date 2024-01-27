import { Request, Response } from 'express';
import { createToken, getRandomId, hash } from '../utilities';
import { Users } from '../mongoose';

/**
 * async handler에서 알아서 리턴해 줄 거라 믿고 예외처리 따윈 하지 않는걸로 ㅎㅎㅎ
 */
async function login(req: Request, res: Response) {
  const user = await Users.findOne({ id: req.body.id });

  if (!user) return res.status(400).json({ success: false, message: '잘못된 아이디 또는 비밀번호' });

  if (hash(req.body.pw) !== user.pw) return res.status(400).json({ success: false, message: '잘못된 아이디 또는 비밀번호' });

  const token = createToken({ userId: user.userId });

  res.status(200).json({ success: true, result: token });
}

async function register(req: Request, res: Response) {
  const user = await Users.findOne({ id: req.body.id });
  if (user) return res.status(400).json({ success: false, message: '이미 존재하는 아이디입니다' });

  await Users.create({
    id: req.body.id,
    pw: hash(req.body.pw),
    userId: getRandomId(),
    nickname: req.body.nickname,
    talkId: req.body.talkId,
    friends: []
  });

  return res.status(200).json({ success: true });
}

export {
  login,
  register
}