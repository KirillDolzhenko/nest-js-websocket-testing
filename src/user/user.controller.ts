import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JWTUserDto, LogInUserDto, UserDto } from './dto/user.dto';
import { Request, Response } from 'express';
import { JwtAccessGuard } from 'src/jwt/guards/access.guard';
import { JwtRefreshGuard } from 'src/jwt/guards/refresh.guard';
import { GetUserJWTId } from './decorators/GetUserJWTId.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("signup")
  async auth(
    @Body() dto: UserDto,
    @Res({ passthrough: true }) response: Response
  ) {

    return await this.userService.createUser(dto, response);
  }


  @Post("login")
  async login(
    @Body() dto: LogInUserDto,
    @Res({ passthrough: true }) response: Response
  ) {
    return await this.userService.logIn(dto, response);
  }


  @UseGuards(JwtRefreshGuard)
  @Get("refresh_token")
  async refreshToken(
    @GetUserJWTId() user: JWTUserDto,
    @Res({ passthrough: true }) response: Response
  ) {
    return await this.userService.refreshToken(user.sub, response);
  }


  @UseGuards(JwtAccessGuard)
  @Post("auth_me")
  async authMe(
    @GetUserJWTId() user: JWTUserDto,
    @Res({ passthrough: true }) response: Response
  ) {
    return await this.userService.authMe(user.sub, response);
  }

  
  @UseGuards(JwtAccessGuard)
  @Get(":id")
  async getUser(@Param("id") id: string) {
    return await this.userService.getUser(id);
  }
}
