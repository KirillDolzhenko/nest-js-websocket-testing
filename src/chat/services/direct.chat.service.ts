import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { DatabaseService } from "src/database/database.service";
import { Socket } from 'socket.io';
import { MessageType, RecipientType } from "@prisma/client";

const activeConnections = new Map<string, Socket>();

@Injectable()
export class DirectChatService {
    constructor (
        private readonly db: DatabaseService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService
    ) {}

    async sendMessage(client: Socket, message: {
        content: string,
        recipient: string
    }) {
        let idSender = client.data.user.sub;
        let idRecipient = message.recipient;

        try {
            let dbSender = await this.db.user.findUnique({
                where: {
                    id: idSender
                }
            })

            if (dbSender) {
                let dbRecipient = await this.db.user.findUnique({
                    where: {
                        id: idRecipient
                    }
                })

                if (dbRecipient) {
                    let dbMessage = await this.db.message.create({
                        data: {
                            content: message.content,
                            senderId: idSender,
                            recipientId: idRecipient,
                            messageType: MessageType.DIRECT,
                            recipientType: RecipientType.DIRECT
                        }
                    })

                    if (dbMessage) {
                        let recipientSocket = await activeConnections.get(idRecipient);
                        
                        if (recipientSocket) {
                            recipientSocket.emit("message", `${message.content}; from: ${idRecipient}`);
                            client.emit("message", `message: ${message.content}; to: ${idRecipient}; success`);
                        } else {
                            client.emit("message", `recipient ${idRecipient} is not connected ${message.content}`);  
                        }
                    } else {
                        client.emit("message", `Error occured during sending message`);  
                    }

                } else {
                    client.emit("message", `Recipient doesn't exist!`);  
                    throw new ForbiddenException("Recipient doesn't exist!");
                }
            
            } else {
                throw new ForbiddenException("You doesn't exist!");
            }
        } catch (error) {
            console.log(error)
            // throw error;
        }

    }

    connection(client: Socket) {
        try {
            const token = client.handshake.headers?.auth || client.handshake.auth?.token; // Получаем токен при подключении
            console.log("token", token)
            
            if (!token) {
              client.disconnect();
              throw new UnauthorizedException("No token provided");
            }
            
            const payload = this.jwt.verify(token, {
              secret: this.config.get("jwt.secret.access")
            }
          );
          client.data.user = payload; 
      
          console.log(payload)
      
          activeConnections.set(payload.sub as string, client);
          
          console.log(`User ${client.id} joined chatroom`)
          client.broadcast.emit("user-join", `User ${client.id} joined chatroom`)
          
        } catch (error) {
            console.log(error)
            
            console.log('Invalid token');
            client.disconnect(); // Отключаем клиента при недействительном токене
        }
    }

    disconnection(client: Socket) {
        activeConnections.delete(client.data.sub);
    
        console.log(`User ${client.id} left chatroom`)
        client.broadcast.emit("user-left", `User ${client.id} left chatroom`)
    }
}