import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController, RoomGateway } from './room.gateway';
import { JwtService } from '@nestjs/jwt';
import { RoomRepository } from './room.repository';
import { RoomRepositoryImpl } from './room.repositoryImpl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/entities/room.entity';
import { QuestionModule } from '../question/question.module';
import { GradingModule } from '../grading/grading.module';
import { RoomUser } from 'src/entities/roomUser.entity';
import { ValidRoot } from 'src/entities/validRoot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomUser, ValidRoot]), QuestionModule, GradingModule],
  controllers: [RoomController],
  providers: [
    RoomGateway,
    RoomService,
    JwtService,
    { provide: RoomRepository, useClass: RoomRepositoryImpl },
    JwtService,
  ],
})
export class RoomModule {}
