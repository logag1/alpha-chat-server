import { Request, Response } from 'express';
import { decodeToken } from '../utilities';
import { AuthRequest } from './request';
import { Users } from '../mongoose';

function getNotice(_req: Request, res: Response) {
  res.send('테스트 공지입니다');
}

/**
 * 
 * @description 내 정보를 가져오는 함수이며 상대의 정보를 가져오는건 따로 만들어야함
 */

async function getMyInfo(req: AuthRequest, res: Response) {
  const user = await Users.findOne({ userId: req.userId });
  if (!user) throw new Error('발생할수가 있는 에러냐 이게');

  return res.status(200).json({
    success: true,
    result: {
      id: user.id,
      nickname: user.nickname,
      talkId: user.talkId
    }
  });
}

async function getInfo(req: Request, res: Response) {
  const user = await Users.findOne({ userId: req.params.userId });
  if (!user) return res.status(400).json({ success: false, message: '존재하지 않는 유저' });

  return res.status(200).json({
    success: true,
    result: {
      nickname: user.nickname
    }
  })
}

async function getFriends(req: AuthRequest, res: Response) {
  const user = await Users.findOne({ userId: req.userId });
  if (!user) throw new Error('발생할수가 있는 에러냐 이게');

  return res.status(200).json({
    success: true,
    result: user.friends
  })
}

async function addFriend(req: AuthRequest, res: Response) {
  const user = await Users.findOne({ userId: req.userId });
  if (!user) throw new Error('발생할수가 있는 에러냐 이게');

  if (user.talkId == req.body.friendTalkId) return res.status(400).json({ success: false, message: '자기 자신을 친구로 추가할 수 없습니다' });

  const friend = await Users.findOne({ talkId: req.body.friendTalkId });
  if (!friend) return res.status(400).json({ success: false, message: '존재하지 않는 챗 아이디에요' });

  if (user.friends.find(obj => obj.userId == friend.userId)) return res.status(400).json({ success: false, message: '이미 친구 추가 되어있는 상대에요' });

  user.friends.push({
    userId: friend.userId,
    nickname: friend.nickname
  });

  await user.save();

  return res.status(200).json({ success: true });
}

async function createChannel(req: Request, res: Response) {

}

export {
  getNotice,
  getMyInfo,
  getFriends,
  addFriend,
  getInfo
}