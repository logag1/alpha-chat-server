import * as dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { Server, Socket } from 'socket.io';
import { TalkHandler } from './handler';
import * as router from './routers';
import { decodeToken } from './utilities';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost/'
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/account', router.auth);
app.use('/talk', router.talk);

app.get('/', (req, res) => {
  res.send('Talk server main page');
});

app.use((req, res, next) => {
  return res.status(404).json({ status: 404, message: 'Not Found' });
});

io.on('connection', async (socket: Socket) => {
  try {
    console.log('Client connected to Socket!');
    /* token 값은 string | string[] 이기에 나중에 에러날 가능성도 있음 => 에러 핸들링 필요 */
    const token = socket.handshake.query.authorization as string;
    const tokenRes = decodeToken(token);
    if (!token || !tokenRes) return socket.disconnect();

    const talkHandler = new TalkHandler(socket);

    socket.on('WRITE', talkHandler.write);
    /**
     * @description 서버가 켜지면 서버는 클라를 참여되어있는 모든 방에 join 시킴
     * 아래 JOIN 이벤트는 클라가 추가로 방을 생성했을 경우임
     */
    socket.on('JOIN', talkHandler.join);
  } catch (e) {
    socket.emit('ERR', 'server error');
    console.log(e);
  }
});

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGOURL!);

mongoose.connection.on("open", async () => {
  console.log('Mongo DB ready');
});

server.listen(process.env.PORT!, () => console.log(`Server listen at port ${process.env.PORT!}`));