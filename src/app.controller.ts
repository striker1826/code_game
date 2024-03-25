import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor() {}

  @Get('/health')
  async healthCheck() {
    return;
  }

  @Get()
  async hello(@Req() req: Request) {}
}
