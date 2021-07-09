import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiExcludeEndpoint()
  home(@Res() response) {
    response.redirect(`${process.env.SWAGGER_PATH}`);
  }
}
