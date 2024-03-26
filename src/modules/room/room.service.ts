import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RoomRepository } from './room.repository';
import { Room } from 'src/entities/room.entity';
import { Socket } from 'socket.io';
import { QuestionRepository } from '../question/question.repository';
import { GradingRepository } from '../grading/grading.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @Inject(RoomRepository) private readonly roomRepository: RoomRepository,
    @Inject(QuestionRepository) private readonly questionRepository: QuestionRepository,
    @Inject(GradingRepository) private readonly gradingRepository: GradingRepository,
    private readonly dataSource: DataSource,
  ) {}

  async socketCreateRoom(roomname: string, client) {
    const room = await this.roomRepository.findRoomByRoomName(roomname);
    if (!room) {
      return { result: false, data: '정상적인 방법으로 입장해주세요.' };
    }

    const isEnterRoom = await this.roomRepository.findRoomIsUserId(client.data.userId);
    if (isEnterRoom[0]) {
      return { result: false, data: null };
    }

    await this.dataSource.transaction(async (manager) => {
      await this.roomRepository.saveRoomUser(room.roomId, client.data.userId, manager);
    });

    client.data['roomId'] = room.roomId;
    client.data.roomname = room.roomname;
    client.join(String(room.roomId));
    return { result: true, data: null };
  }

  async createRoom({ roomname }, userId: number): Promise<Room> {
    const isRoom = await this.roomRepository.findRoomByRoomName(roomname);
    if (isRoom) {
      throw new BadRequestException('이미 존재하는 방입니다.');
    }

    const isEnterRoom = await this.roomRepository.findRoomIsUserId(userId);
    if (isEnterRoom) {
      throw new BadRequestException('이미 방에 입장한 유저입니다.');
    }

    let createdRoom;
    await this.dataSource.transaction(async (manager) => {
      createdRoom = await this.roomRepository.saveRoom(roomname, manager);
    });

    return createdRoom;
  }

  async joinRoom(roomname: string, client: Socket): Promise<{ result: boolean; data: number | String }> {
    const findedRoom = await this.roomRepository.findRoomByRoomName(roomname);

    const isEnterRoom = await this.roomRepository.findRoomIsUserId(client.data.userId);
    if (isEnterRoom) {
      return { result: false, data: null };
    }

    if (!findedRoom || findedRoom.count >= 2 || findedRoom.isReady) {
      return { result: false, data: '비정상 경로' };
    }

    await this.dataSource.transaction(async (manager) => {
      await this.roomRepository.updateRoomCountIncrease(findedRoom.roomId, findedRoom.count, manager);
      await this.roomRepository.saveRoomUser(findedRoom.roomId, client.data.userId, manager);
    });

    client.data.roomname = roomname;
    client.data.roomId = findedRoom.roomId;

    client.join(String(findedRoom.roomId));
    return { result: true, data: findedRoom.roomId };
  }

  async httpJoinRoom(roomname: string, userId: number) {
    const findedRoom = await this.roomRepository.findRoomByRoomName(roomname);
    if (!findedRoom) throw new NotFoundException('존재하지 않는 방입니다.');
    if (findedRoom.count >= 2) throw new BadRequestException('방이 꽉 찼습니다.');
    if (findedRoom.isReady) throw new UnauthorizedException('이미 시작된 방입니다.');

    const isEnterRoom = await this.roomRepository.findRoomIsUserId(userId);
    if (isEnterRoom[0]) {
      throw new BadRequestException('이미 방에 입장한 유저입니다.');
    }

    return;
  }

  async getRoomList(): Promise<Room[]> {
    const roomList = await this.roomRepository.findRoomList();
    return roomList;
  }

  async deleteRoom(roomId, userId: number): Promise<void> {
    const room = await this.roomRepository.findRoomByRoomId(roomId);

    if (!room) {
      return;
    }

    await this.dataSource.transaction(async (manager) => {
      if (room && room.count !== 1) {
        await this.roomRepository.deleteRoomUser(roomId, userId, manager);
        await this.roomRepository.updateRoomCountDecrease(roomId, manager);
      } else {
        await this.roomRepository.deleteRoomUser(roomId, userId, manager);
        await this.roomRepository.deleteRoom(roomId, manager);
      }
    });

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

  async invalidEnterRoom(userId: number) {
    const isEnterRoom = await this.roomRepository.findRoomIsUserId(userId);
    if (isEnterRoom) {
      throw new BadRequestException('이미 방에 입장한 유저입니다.');
    }
  }
}
