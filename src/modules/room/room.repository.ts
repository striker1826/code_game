import { Room } from 'src/entities/room.entity';

export interface RoomRepository {
  saveRoom(roomname: string): Promise<Room>;
  findRoomByRoomName(roomname: string): Promise<Room>;
  updateRoomCountIncrease(roomId: number, count: number): Promise<void>;
  updateRoomCountDecrease(roomId: number): Promise<void>;
  findRoomList(): Promise<Room[]>;
  findRoomByRoomId(roomId: number): Promise<Room>;
  deleteRoom(roomId: number): Promise<void>;
}

export const RoomRepository = Symbol('RoomRepository');
