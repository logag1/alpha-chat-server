import { Schema } from 'mongoose';

export const Friend = new Schema({
  nickname: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});