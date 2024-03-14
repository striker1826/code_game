import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RoomRepository } from './room.repository';
import { Room } from 'src/entities/room.entity';

@Injectable()
export class RoomService {
  constructor(@Inject(RoomRepository) private readonly roomRepository: RoomRepository) {}

  async createRoom(roomname: string, client): Promise<void> {
    const roomList = await this.roomRepository.findRoomList();
    for (const room of roomList) {
      if (room.roomname === roomname) {
        throw new BadRequestException('이미 존재하는 방입니다.');
      }
    }
    const room = await this.roomRepository.saveRoom(roomname);
    client.data.roomId = room.roomId;
    client.join(room.roomId);
    return;
  }

  async joinRoom(roomId: number): Promise<void> {
    const findedRoom = await this.roomRepository.findRoomByRoomName(roomId);
    if (!findedRoom) throw new Error('존재하지 않는 방입니다.');
    await this.roomRepository.updateRoomCountIncrease(roomId, findedRoom.count);
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
}
