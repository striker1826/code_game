import { Module } from '@nestjs/common';
import { GradingService } from './grading.service';
import { GradingController } from './grading.controller';
import { GradingRepository } from './grading.repository';
import { GradingRepositoryImpl } from './grading.repositoryImpl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCase } from 'src/entities/testCase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestCase])],
  controllers: [GradingController],
  providers: [GradingService, { provide: GradingRepository, useClass: GradingRepositoryImpl }],
  exports: [GradingService, GradingRepository],
})
export class GradingModule {}
