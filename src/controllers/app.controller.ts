import { Controller, Get } from '@nestjs/common';


@Controller()
export class AppController {
  @Get()
  getIndex(): string {
    return 'Home page';
  }

}
