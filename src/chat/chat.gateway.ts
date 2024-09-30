import { Socket } from 'socket.io';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ClientRequest, Server } from 'http';
import { DatabaseService } from 'src/database/database.service';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAccessSocketGuard } from 'src/jwt/guards/access.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DirectChatService } from './services/direct.chat.service';
import { SendMessageDto } from './dto/chat.dto';

const activeConnetctions = new Map<string, Socket>();

@WebSocketGateway({
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
    allowedHeaders: ['content-type'],
    credentials: true}, 
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  
  @WebSocketServer() server: Server;
  
  constructor(
    private readonly directChatService: DirectChatService
  ) {}
  
  // @UseGuards(JwtAccessSocketGuard)
  // @SubscribeMessage("message_group")
  // handleSignal(client: Socket, message: any) {
  //   client.broadcast.emit("signal", `message: ${message}`)
  // }

  @UseGuards(JwtAccessSocketGuard)
  @SubscribeMessage("message")
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() message: SendMessageDto) {
    this.directChatService.sendMessage(client, message)
  }
  
  handleConnection(client: Socket) {
    this.directChatService.connection(client)
  }
  
  handleDisconnect(client: Socket) {
    this.directChatService.disconnection(client)
  }

  afterInit(server: any) {}
}
