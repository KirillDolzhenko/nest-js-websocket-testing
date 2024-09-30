import { JwtAccessGuard } from './../jwt/guards/access.guard';
import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AllUsersDto, JWTUserDto, LogInUserDto, SettingsUserDto, UserDto } from './dto/user.dto';
import { Response } from 'express';
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

  @Get("refresh_token")
  @UseGuards(JwtRefreshGuard)
  async refreshToken(
    @GetUserJWTId() user: JWTUserDto,
    @Res({ passthrough: true }) response: Response
  ) {
    return await this.userService.refreshToken(user.sub, response);
  }

  @Post("auth_me")
  @UseGuards(JwtAccessGuard)
  async authMe(
    @GetUserJWTId() user: JWTUserDto,
    @Res({ passthrough: true }) response: Response
  ) {
    return await this.userService.authMe(user.sub, response);
  }

  @Post("logout")
  @UseGuards(JwtAccessGuard)
  async logOut(
    @GetUserJWTId() user: JWTUserDto,
    @Res({ passthrough: true }) response: Response
  ) {
    return await this.userService.logOut(user.sub, response);
  }
  
  @Get(":id")
  @UseGuards(JwtAccessGuard)
  async getUser(@Param("id") id: string) {
    // console.log('fddffd')
    return await this.userService.getUser(id);
  }

  @Patch()
  @UseGuards(JwtAccessGuard)
  async updateUser(
    @GetUserJWTId() user: JWTUserDto,
    @Body() dto: SettingsUserDto
  ) {
      console.log(dto)
      return await this.userService.patchInfo(dto, user.sub)
  }
  
  @Delete("pic_profile")
  @UseGuards(JwtAccessGuard)
  async removePicProfile(@GetUserJWTId() user: JWTUserDto) {
      return await this.userService.removeProfilePic(user.sub)
  }
  
  @Post("search")
  @UseGuards(JwtAccessGuard)
  async searchUsers(
    @GetUserJWTId() user: JWTUserDto,
    @Query("query") query: string
  ) {
      if (!query.length) {
        throw new ForbiddenException("Undefined request")
      }

      console.log("fff",  query)
      return await this.userService.searchUsers(user.sub, query)
  }


  @Post("/contacts/all")
  @UseGuards(JwtAccessGuard)
  async getAllUsers(
    @GetUserJWTId() user: JWTUserDto,
    @Body() dto: AllUsersDto,
  ) {
    console.log(dto)
    return await this.userService.getAllUsers(user.sub, dto.arrId);
  }
}
