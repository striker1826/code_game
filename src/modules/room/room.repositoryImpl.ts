import { InjectRepository } from '@nestjs/typeorm';
import { RoomRepository } from './room.repository';
import { Room } from 'src/entities/room.entity';
import { EntityManager, Repository } from 'typeorm';
import { RoomUser } from 'src/entities/roomUser.entity';
import { ValidRoot } from 'src/entities/validRoot.entity';

export class RoomRepositoryImpl implements RoomRepository {
  constructor(
    @InjectRepository(Room) private readonly roomModel: Repository<Room>,
    @InjectRepository(RoomUser) private readonly roomUserModel: Repository<RoomUser>,
    @InjectRepository(ValidRoot) private readonly validRootModel: Repository<ValidRoot>,
  ) {}

  async saveRoom(roomname: string, manager: EntityManager): Promise<Room> {
    const newRoom = manager.getRepository(Room).create();
    newRoom.roomname = roomname;
    newRoom.count = 1;
    newRoom.ready = 0;
    newRoom.isReady = false;
    const createdRoom = await manager.getRepository(Room).save(newRoom);
    return createdRoom;
  }

  async findRoomByRoomName(roomname: string): Promise<Room> {
    const room = await this.roomModel.findOne({ where: { roomname } });
    return room;
  }

  async updateRoomCountIncrease(roomId: number, count: number, manager: EntityManager): Promise<void> {
    await manager.getRepository(Room).increment({ roomId, count: 1 }, 'count', 1);
    return;
  }

  async updateRoomCountDecrease(roomId: number, manager: EntityManager): Promise<void> {
    await manager.getRepository(Room).decrement({ roomId }, 'count', 1);
    return;
  }

  async updateRoomReadyIncrease(roomId: number): Promise<void> {
    await this.roomModel.increment({ roomId }, 'ready', 1);
  }

  async updateRoomIsUnReady(roomId: number): Promise<void> {
    await this.roomModel.update({ roomId }, { isReady: false });
  }

  async updateRoomReadyReset(roomId: number): Promise<void> {
    await this.roomModel.update({ roomId }, { ready: 0 });
  }

  async updateRoomISReady(roomId: number): Promise<void> {
    await this.roomModel.update({ roomId }, { isReady: true });
  }

  async findRoomList(): Promise<Room[]> {
    const roomList = await this.roomModel.find();
    return roomList;
  }

  async findRoomByRoomId(roomId: number): Promise<Room> {
    const room = await this.roomModel.findOne({ where: { roomId } });
    return room;
  }

  async deleteRoom(roomId: number, manager: EntityManager): Promise<void> {
    await manager.getRepository(Room).delete({ roomId });
    return;
  }

  async findRoomIsUserId(userId: number) {
    const roomUser = await this.roomUserModel.findOne({ where: { userId } });
    console.log(roomUser);
    return roomUser;
  }

  async saveRoomUser(roomId: number, userId: number, manager: EntityManager): Promise<void> {
    const newRoomUser = manager.getRepository(RoomUser).create();
    newRoomUser.roomId = roomId;
    newRoomUser.userId = userId;
    await manager.getRepository(RoomUser).save(newRoomUser);
    return;
  }

  async deleteRoomUser(roomId: number, userId: number, manager: EntityManager): Promise<void> {
    await manager.getRepository(RoomUser).delete({ roomId, userId });
    return;
  }

  async saveRoomUserKey(roomId: number, userId: number, key: string, manager: EntityManager): Promise<void> {
    const newKey = manager.getRepository(RoomUser).create();
    newKey.key = key;
    newKey.userId = userId;
    newKey.roomId = roomId;
    await manager.getRepository(RoomUser).save(newKey);
    return;
  }

  async findRoomUserKey(roomId: number, userId: number, key: string): Promise<ValidRoot> {
    const isKey = await this.validRootModel.findOne({ where: { roomId, userId, root: key } });
    return isKey;
  }

  async saveUserKey(roomId: number, userId: number, key: string, manager: EntityManager): Promise<void> {
    const validRoot = manager.getRepository(ValidRoot).create();
    validRoot.root = key;
    validRoot.userId = userId;
    validRoot.roomId = roomId;
    await manager.getRepository(RoomUser).save(validRoot);
    return;
  }
}
