import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
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
    return await this.groupService.createGroup(user.sub, dto);
  } 
  
  @Get("all")
  @UseGuards(JwtAccessGuard)
  async getMyGroups(
    @GetUserJWTId() user: JWTUserDto,
  ) {
    return await this.groupService.getMyGroups(user.sub);
  } 
  
  @Get(":id")
  @UseGuards(JwtAccessGuard)
  async getGroup(
    @GetUserJWTId() user: JWTUserDto,
    @Param("id") groupId: string
  ) {
    return await this.groupService.getGroup(user.sub, groupId);
  } 

  @Get("messages/:id")
  @UseGuards(JwtAccessGuard)
  async getGroupMessages(
    @GetUserJWTId() user: JWTUserDto,
    @Param("id") groupId: string
  ) {
    console.log(groupId, "---param")
    return await this.groupService.getGroupMessages(user.sub, groupId);
  } 

  @Get("members/:id")
  @UseGuards(JwtAccessGuard)
  async getGroupMembers(
    @GetUserJWTId() user: JWTUserDto,
    @Param("id") groupId: string
  ) {
    return await this.groupService.getGroupMembers(user.sub, groupId);
  } 

}
