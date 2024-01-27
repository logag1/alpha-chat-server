import { Socket } from 'socket.io';

interface Chat {
  channelId: string,
  userId: string,
  text: string,
  timestamp: Date
}

export class TalkHandler {
  constructor(private _socket: Socket) {
    /**
     * @description
     * 
     * 생성자 함수의 인자로 들어간 소켓이
     * this._socket으로 가져와지지 않는 문제를 해결하기 위함 (데이터 바인딩)
     */
    this.write = this.write.bind(this);
    this.join = this.join.bind(this);
  }

  /**
   * @todo 클라이언트에서 위조된 값을 보낼 수 있기에 data 검증 절차가 필요함
   * 
   * 방 관련: 클라이언트는 로그인시 참여중인 채널아이디들을 받아옴,
   * 클라에서 방을 클릭시 해당 채널 (room_channelId)에 join함
   */
  async write(data: Chat) {
    console.log(data);
    this._socket.to(`room_${data.channelId}`).emit('MSG', data);
  }

  async join(channelId: string) {
    console.log(`Client join channelId: ${channelId}`);
    this._socket.join(`room_${channelId}`);
  }
}