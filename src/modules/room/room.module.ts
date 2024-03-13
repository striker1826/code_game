import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomGateway } from './room.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [RoomGateway, RoomService, JwtService],
})
export class RoomModule {}
