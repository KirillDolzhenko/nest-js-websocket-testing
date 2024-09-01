import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("auth")
  auth(@Body() dto: UserDto) {
    return this.userService.createUser(dto);
  }
}
