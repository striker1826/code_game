import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RoomRepository } from './room.repository';
import { Room } from 'src/entities/room.entity';
import { Socket } from 'socket.io';
import { QuestionService } from '../question/question.service';
import { QuestionRepository } from '../question/question.repository';
import { WsException } from '@nestjs/websockets';
import { GradingRepository } from '../grading/grading.repository';

@Injectable()
export class RoomService {
  constructor(
    @Inject(RoomRepository) private readonly roomRepository: RoomRepository,
    @Inject(QuestionRepository) private readonly questionRepository: QuestionRepository,
    @Inject(GradingRepository) private readonly gradingRepository: GradingRepository,
  ) {}

  async socketCreateRoom(roomname: string, client): Promise<void> {
    const room = await this.roomRepository.findRoomByRoomName(roomname);
    client.data.roomId = room.roomId;
    client.data.roomname = room.roomname;
    client.join(String(room.roomId));
    return;
  }

  async createRoom({ roomname }): Promise<Room> {
    const isRoom = await this.roomRepository.findRoomByRoomName(roomname);
    if (isRoom) {
      throw new BadRequestException('이미 존재하는 방입니다.');
    }
    const createdRoom = await this.roomRepository.saveRoom(roomname);
    return createdRoom;
  }

  async joinRoom(roomname: string, client: Socket): Promise<Room> {
    const findedRoom = await this.roomRepository.findRoomByRoomName(roomname);
    await this.roomRepository.updateRoomCountIncrease(findedRoom.roomId, findedRoom.count);
    client.data.roomname = roomname;
    client.data.roomId = findedRoom.roomId;

    client.join(String(findedRoom.roomId));
    return findedRoom;
  }

  async httpJoinRoom(roomname: string) {
    const findedRoom = await this.roomRepository.findRoomByRoomName(roomname);
    if (!findedRoom) throw new NotFoundException('존재하지 않는 방입니다.');
    if (findedRoom.count >= 2) throw new BadRequestException('방이 꽉 찼습니다.');
    if (findedRoom.isReady) throw new UnauthorizedException('이미 시작된 방입니다.');
    return;
  }

  async getRoomList(): Promise<Room[]> {
    const roomList = await this.roomRepository.findRoomList();
    return roomList;
  }

  async deleteRoom(roomId: number): Promise<void> {
    const room = await this.roomRepository.findRoomByRoomId(roomId);

    if (room && room.count !== 1) {
      await this.roomRepository.updateRoomCountDecrease(roomId);
    } else {
      await this.roomRepository.deleteRoom(roomId);
    }

    return;
  }

  async readyIncrease(roomId: number) {
    await this.roomRepository.updateRoomReadyIncrease(roomId);
    const room = await this.roomRepository.findRoomByRoomId(roomId);
    if (room.ready < room.count) {
      return { result: false, data: null };
    }

    // 게임 시작
    if (room.ready >= room.count) {
      await this.roomRepository.updateRoomISReady(roomId);
      await this.roomRepository.updateRoomReadyReset(roomId);
      const questions = await this.questionRepository.findQuestions();
      questions.sort(() => Math.random() - 0.5);

      const testCases = await this.gradingRepository.findSampleTestCaseByQuestionId(questions[0].questionId);
      return { result: true, data: questions[0], testCases: testCases };
    }
  }

  async updateRoomIsUnReady(roomId: number) {
    await this.roomRepository.updateRoomIsUnReady(roomId);
    return;
  }
}
