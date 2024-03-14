import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController, RoomGateway } from './room.gateway';
import { JwtService } from '@nestjs/jwt';
import { RoomRepository } from './room.repository';
import { RoomRepositoryImpl } from './room.repositoryImpl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  controllers: [RoomController],
  providers: [RoomGateway, RoomService, { provide: RoomRepository, useClass: RoomRepositoryImpl }, JwtService],
})
export class RoomModule {}
