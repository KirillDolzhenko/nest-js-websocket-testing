import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { DatabaseService } from "src/database/database.service";
import { Socket } from 'socket.io';
import { MessageType, RecipientType } from "@prisma/client";
import { chatGroupSelect, chatUserSelect } from "../select/chat.select";
import { SendMessageDto } from "../dto/chat.dto";

import * as path from "path";
import * as fs from "fs";
import sendError from "../functions/chat.functions";

const activeConnections = new Map<string, Socket>();

@Injectable()
export class DirectChatService {
    constructor (
        private readonly db: DatabaseService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService
    ) {}

    // async sendError(client: Socket, message: string) {
    //     client.emit("Error", {
    //         type: "message",
    //         message
    //     }); 
    // }

    async sendMessage(client: Socket, message: SendMessageDto) {
        let idSender = client.data.user.sub;
        let idRecipient = message.recipient;

        try {
            let dbSender = await this.db.user.findUnique({
                where: {
                    id: idSender
                }
            })

            if (dbSender) {
                let dbRecipient = message.recipientType == RecipientType.DIRECT ? await this.db.user.findUnique({
                    where: {
                        id: idRecipient
                    }
                }) : await this.db.group.findUnique({
                    where: {
                        id: message.recipient
                    },
                    select: {
                        membersId: true,
                        adminId: true
                    }
                })

                if (dbRecipient) {
                    let dbMessage = await this.db.message.create({
                        data: {
                            content: message.content,
                            senderId: idSender,
                            recipientId: message.recipientType == RecipientType.DIRECT ? idRecipient : undefined,
                            messageType: message.messageType,
                            recipientType: message.recipientType,
                            fileSize: message.messageType == MessageType.FILE ? await fs.statSync(path.join("uploads",...message.content.split("/").slice(-3))).size : undefined,
                            recipientGroupId: message.recipientType == RecipientType.GROUP ? idRecipient : undefined,
                        },
                        include: {
                          sender: {
                            select: {
                                ...chatUserSelect
                            }
                          },
                          recipient: {
                            select: {
                                ...chatUserSelect,
                            }
                          },
                          recipientGroup: {
                            select: {
                                ...chatGroupSelect,
                            }
                          }
                        }
                    })

                    if (dbMessage) {
                        if (dbMessage.recipientType == RecipientType.DIRECT) {
                            if (idSender !== dbMessage.recipientId) {
                                let recipientSocket = await activeConnections.get(idRecipient);

                                if (recipientSocket) {
                                    recipientSocket.emit("message", dbMessage);
                                }
                            }

                            console.log(dbMessage)

                            client.emit("message", dbMessage); 
                        } else if (dbMessage.recipientType == RecipientType.GROUP) {
                            
                            let group = dbRecipient as {
                                membersId: string[],
                                adminId: string
                            }

                            for (let i = 0; i < group.membersId.length; i++) {
                                if (group.membersId[i] !== idSender) {
                                    let recipientSocket = await activeConnections.get(group.membersId[i]);
                                    
                                    if (recipientSocket) {
                                        recipientSocket.emit("message", dbMessage);
                                    }   
                                }
                            }

                            client.emit("message", dbMessage);
                            
                            if (group.adminId !== idSender) {
                                let recipientSocket = await activeConnections.get(group.adminId);
                                
                                if (recipientSocket) {
                                    recipientSocket.emit("message", dbMessage);
                                }
                            }
                        }
                    } else {
                        sendError(client, `Error occured during sending message`);  
                    }

                } else {
                    sendError(client, `Recipient doesn't exist!`);  
                    throw new ForbiddenException("Recipient doesn't exist!");
                }
            
            } else {
                sendError(client, `You doesn't exist!`);
            }
        } catch (error) {
            sendError(client, `Something goes wrong!`);
        }
    }

    connection(client: Socket) {
        try {
            const token = client.handshake.headers?.auth || client.handshake.auth?.token; // Получаем токен при подключении
            
            if (!token) {
                console.log("There is no token")
                sendError(client, `There is no token`);
                client.disconnect();
            }
            
            const payload = this.jwt.verify(token, {
              secret: this.config.get("jwt.secret.access")
            }
          );
          client.data.user = payload; 

          activeConnections.set(payload.sub as string, client);
          
          console.log(`User ${client.id} joined chatroom`)
          client.broadcast.emit("user-join", `User ${client.id} joined chatroom`)
          
        } catch (error) {
            console.log(error)
            
            sendError(client, `Unauthorized`);

            client.disconnect(); // Отключаем клиента при недействительном токене
        }
    }

    disconnection(client: Socket) {
        activeConnections.delete(client.data.sub);
    
        console.log(`User ${client.id} left chatroom`)
        client.broadcast.emit("user-left", `User ${client.id} left chatroom`)
    }
}