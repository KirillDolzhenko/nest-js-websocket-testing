import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAccessGuard } from 'src/jwt/guards/access.guard';
import { JWTUserDto } from 'src/user/dto/user.dto';
import { GetUserJWTId } from 'src/user/decorators/GetUserJWTId.decorator';
import { GetMessagesDirectDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("/messages/direct")
  @UseGuards(JwtAccessGuard)
  async getMessagesDirect(
    @GetUserJWTId() user: JWTUserDto,
    @Body() dto: GetMessagesDirectDto
  ) {

    console.log("Smt")
    return await this.chatService.getMessagesDirect(user, dto)
  }

  @Get("/contacts/direct")
  @UseGuards(JwtAccessGuard)
  async getContactsDirect(@GetUserJWTId() user: JWTUserDto) {

    return await this.chatService.getContactsDirect(user)
  }

}
