import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Socket, Server } from 'socket.io';
import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/strategy/jwt/websocket.guard';
import { Request } from 'express';
import { QuestionService } from '../question/question.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { JwtService } from '@nestjs/jwt';
import { Room } from 'src/entities/room.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
})
export class RoomGateway {
  constructor(
    private readonly roomService: RoomService,
    private readonly questionService: QuestionService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('enterLobby')
  enterLobby(@ConnectedSocket() client: Socket, @MessageBody() data) {
    client.data.roomname = 'lobby';
    client.join('lobby');
  }

  @SubscribeMessage('createRoom')
  async createRoom(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { roomname, access_token } = data;
    const { userId } = this.jwtService.verify(access_token, { secret: process.env.ACCESS_TOKEN_SECRET });

    client.data['userId'] = userId;
    client.data.roomname = roomname;

    const result = await this.roomService.socketCreateRoom(roomname, client);
    if (!result.result && result.data === '존재하지 않는 방입니다.') {
      client.emit('isNotExistRoom');
      return;
    } else if (!result.result && result.data === null) {
      client.emit('isEnterRoom');
      return;
    } else {
      client.broadcast.emit('createdRoom');
      return;
    }
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { roomname, access_token } = data;
    const { userId } = this.jwtService.verify(access_token, { secret: process.env.ACCESS_TOKEN_SECRET });
    client.data['userId'] = userId;

    const room = await this.roomService.joinRoom(roomname, client);
    if (room.result === false) {
      client.emit('isEnterRoom');
      return;
    } else if (!room.result && room.data === '비정상 경로') {
      client.emit('invalidRoot');
      return;
    } else {
      `${roomname} 방에 입장하셨습니다.`;
      client.to(String(room.data)).emit('joinRoom', `${roomname} 방에 사람이 입장하였습니다.`);
    }
  }

  @SubscribeMessage('playerWin')
  async playerWin(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { roomId } = client.data;
    await this.roomService.updateRoomIsUnReady(roomId);

    client.to(roomId).emit('playerLose', 'aaa');
  }

  @SubscribeMessage('syncQuestion')
  async syncQuestion(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { questionId } = data;
    const { roomId } = client.data;
    questionId;

    const question = await this.questionService.getQuestionById(questionId);

    client.to(roomId).emit('syncQuestion', question);
  }

  @SubscribeMessage('ready')
  async playerReady(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { roomId } = client.data;
    const result = await this.roomService.readyIncrease(roomId);
    if (result.result) {
      client.emit('start', { question: result.data, testCases: result.testCases });
      client.to(roomId).emit('start', { question: result.data, testCases: result.testCases });
      return;
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const { roomId } = client.data;
    const userId = client.data.userId;
    await this.roomService.deleteRoom(roomId, userId);
    client.to(roomId).emit('leaveRoom', '상대방이 방에서 나갔습니다.');
    client.broadcast.emit('createdRoom');
    client.leave(client.data.roomname);
  }
}

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async createRoom(@Body() roomData: { roomname: string }, @User() userId: number) {
    const createdRoom = await this.roomService.createRoom(roomData, userId);
    return createdRoom;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('')
  async httpJoinRoom(@Body() roomData: { roomname: string }, @User() userId: number) {
    await this.roomService.httpJoinRoom(roomData.roomname, userId);
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/check')
  async checkRoomInvalid(@User() userId: number) {
    await this.roomService.invalidEnterRoom(userId);
  }

  @Get('/list')
  async getRoomList(@Req() req: Request) {
    const roomList = await this.roomService.getRoomList();
    return roomList;
  }
}
