import { model, Schema } from 'mongoose';
import { Friend } from './friends';

export const Users = model(
  "users",
  new Schema({
    id: {
      type: String,
      required: true
    },
    pw: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    nickname: {
      type: String,
      required: true
    },
    email: { // 이메일 인증을 받은 경우에만 추가됨
      type: String,
      required: false
    },
    talkId: { // 가입할 때 같이 넣는걸로
      type: String,
      required: true
    },
    friends: [Friend]
  })
);