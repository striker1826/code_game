import { Room } from 'src/entities/room.entity';
import { RoomUser } from 'src/entities/roomUser.entity';
import { ValidRoot } from 'src/entities/validRoot.entity';
import { EntityManager } from 'typeorm';

export interface RoomRepository {
  saveRoom(roomname: string, manager: EntityManager): Promise<Room>;
  findRoomByRoomName(roomname: string): Promise<Room>;
  updateRoomCountIncrease(roomId: number, count: number, manager: EntityManager): Promise<void>;
  updateRoomCountDecrease(roomId: number, manager: EntityManager): Promise<void>;
  findRoomList(): Promise<Room[]>;
  findRoomByRoomId(roomId: number): Promise<Room>;
  updateRoomReadyIncrease(roomId: number): Promise<void>;
  updateRoomReadyReset(roomId: number): Promise<void>;
  deleteRoom(roomId: number, manager: EntityManager): Promise<void>;
  updateRoomISReady(roomId: number): Promise<void>;
  updateRoomIsUnReady(roomId: number): Promise<void>;
  findRoomIsUserId(userId: number);
  saveRoomUser(roomId: number, userId: number, manager: EntityManager): Promise<void>;
  saveRoomUserKey(roomId: number, userId: number, key: string, manager: EntityManager): Promise<void>;
  deleteRoomUser(roomId: number, userId: number, manager: EntityManager): Promise<void>;
  findRoomUserKey(roomId: number, userId: number, key: string): Promise<ValidRoot>;
  saveUserKey(roomId: number, userId: number, key: string, manager: EntityManager): Promise<void>;
}

export const RoomRepository = Symbol('RoomRepository');
