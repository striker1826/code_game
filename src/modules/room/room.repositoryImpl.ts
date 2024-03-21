import { InjectRepository } from '@nestjs/typeorm';
import { RoomRepository } from './room.repository';
import { Room } from 'src/entities/room.entity';
import { Repository } from 'typeorm';

export class RoomRepositoryImpl implements RoomRepository {
  constructor(@InjectRepository(Room) private readonly roomModel: Repository<Room>) {}

  async saveRoom(roomname: string): Promise<Room> {
    const newRoom = this.roomModel.create();
    newRoom.roomname = roomname;
    newRoom.count = 1;
    newRoom.ready = 0;
    newRoom.isReady = false;
    const createdRoom = await this.roomModel.save(newRoom);
    return createdRoom;
  }

  async findRoomByRoomName(roomname: string): Promise<Room> {
    const room = await this.roomModel.findOne({ where: { roomname } });
    return room;
  }

  async updateRoomCountIncrease(roomId: number, count: number): Promise<void> {
    await this.roomModel.increment({ roomId, count: 1 }, 'count', 1);
    return;
  }

  async updateRoomCountDecrease(roomId: number): Promise<void> {
    await this.roomModel.decrement({ roomId }, 'count', 1);
    return;
  }

  async updateRoomReadyIncrease(roomId: number): Promise<void> {
    await this.roomModel.increment({ roomId }, 'ready', 1);
  }

  async updateRoomReadyReset(roomId: number): Promise<void> {
    await this.roomModel.update({ roomId }, { ready: 0 });
  }

  async findRoomList(): Promise<Room[]> {
    const roomList = await this.roomModel.find();
    return roomList;
  }

  async findRoomByRoomId(roomId: number): Promise<Room> {
    const room = await this.roomModel.findOne({ where: { roomId } });
    return room;
  }

  async deleteRoom(roomId: number): Promise<void> {
    await this.roomModel.delete({ roomId });
  }
}
