import { Socket } from 'socket.io';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ClientRequest, Server } from 'http';

@WebSocketGateway(3010, {
  cors: {
    origin: "*"
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer() server: Server;

  @SubscribeMessage("newMessage")
  handleNewMessage(client: Socket, message: any) {
    console.log(client)
    console.log(message)

    this.server.emit("message", message)
  }

  handleConnection(client: any, ...args: any[]) {
    client.broadcast.emit("user-join", `User ${client.id} joined chatroom`)
  }

  handleDisconnect(client: any) {
    client.broadcast.emit("user-left", `User ${client.id} left chatroom`)
  }


}
