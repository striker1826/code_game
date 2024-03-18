import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Socket, Server } from 'socket.io';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/strategy/jwt/websocket.guard';
import { Request } from 'express';
import { QuestionService } from '../question/question.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
})
export class RoomGateway {
  constructor(private readonly roomService: RoomService, private readonly questionService: QuestionService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit('connection', { id: client.id });
  }

  @SubscribeMessage('enterLobby')
  enterLobby(@ConnectedSocket() client: Socket) {
    client.data.roomname = 'lobby';
    client.join('lobby');
  }

  @SubscribeMessage('createRoom')
  async createRoom(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { roomname } = data;
    client.data.roomname = roomname;
    await this.roomService.socketCreateRoom(roomname, client);
    console.log(`${roomname} 방이 생성되었습니다.`);
    client.broadcast.emit('createdRoom');
    return;
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { roomname } = data;
    console.log('roomname: ', roomname);
    const room = await this.roomService.joinRoom(roomname, client);
    console.log(`${roomname} 방에 입장하셨습니다.`);
    client.to(String(room.roomId)).emit('joinRoom', `${roomname} 방에 사람이 입장하였습니다.`);
  }

  @SubscribeMessage('playerWin')
  playerWin(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { roomId } = client.data;
    console.log('send: ', roomId);
    client.to(roomId).emit('playerLose', 'aaa');
  }

  @SubscribeMessage('syncQuestion')
  async syncQuestion(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { questionId } = data;
    const { roomId } = client.data;
    console.log(questionId);
    console.log(roomId);
    const question = await this.questionService.getQuestionById(questionId);
    console.log(question);
    client.to(roomId).emit('syncQuestion', question);
  }

  @SubscribeMessage('ready')
  async playerReady(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { roomId } = client.data;
    const result = await this.roomService.readyIncrease(roomId);
    if (result.result) {
      console.log(result.data);
      client.emit('start', result.data);
      client.to(roomId).emit('start', result.data);
      return;
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const { roomId } = client.data;
    await this.roomService.deleteRoom(roomId);
    client.to(roomId).emit('leaveRoom', '상대방이 방에서 나갔습니다.');
    client.leave(client.data.roomname);
  }
}

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('')
  async createRoom(@Body() roomData: { roomname: string }) {
    const createdRoom = await this.roomService.createRoom(roomData);
    return createdRoom;
  }

  @Get('/list')
  async getRoomList(@Req() req: Request) {
    console.log(req.headers.authorization);
    const roomList = await this.roomService.getRoomList();
    return roomList;
  }
}
