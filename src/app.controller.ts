import { Controller, Get } from '@nestjs/common';


@Controller()
export class AppController {
  
  @Get()
  getHello(): string {
    return 'Hello world !';
  }

  @Get('world')
  getWorld(): string {
    return 'World !';
  }
}
