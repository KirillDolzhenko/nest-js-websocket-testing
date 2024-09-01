import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway(3010, {
  cors: false
})
export class ChatGateway {
  @SubscribeMessage("newMessage")
  handleNewMessage(@MessageBody() message: any) {
    console.log((message))
  }

  
}
