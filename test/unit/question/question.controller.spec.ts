import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from '../../../src/modules/question/question.controller';
import { QuestionService } from '../../../src/modules/question/question.service';

describe('QuestionController', () => {
  let controller: QuestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [QuestionService],
    }).compile();

    controller = module.get<QuestionController>(QuestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
