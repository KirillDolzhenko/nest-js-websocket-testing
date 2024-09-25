import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { JwtAccessGuard } from 'src/jwt/guards/access.guard';
import { GroupDto } from './dto/group.dto';
import { GetUserJWTId } from 'src/user/decorators/GetUserJWTId.decorator';
import { JWTUserDto } from 'src/user/dto/user.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  async createGroup(
    @GetUserJWTId() user: JWTUserDto,
    @Body() dto: GroupDto
  ) {
    console.log(dto)

    return await this.groupService.createGroup(user.sub, dto);
  } 
}
