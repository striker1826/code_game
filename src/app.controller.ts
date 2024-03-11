import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    console.log(process.env.DATABASE_HOST);
    console.log(process.env.DATABASE_USER);
    console.log(process.env.DATABASE_PASSWORD);
    console.log(process.env.DATABASE_NAME);
    // return this.appService.test(`function string(input) {

    // return input
    // }`);
  }
}
