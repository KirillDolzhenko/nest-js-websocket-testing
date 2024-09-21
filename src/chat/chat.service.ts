import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { JWTUserDto } from 'src/user/dto/user.dto';
import { GetMessagesDirectDto } from './dto/chat.dto';
import { chatUserSelect } from './select/chat.select';

@Injectable()
export class ChatService {
    constructor(
        private readonly db: DatabaseService,
    ) {}

    async getMessagesDirect(user: JWTUserDto, dto: GetMessagesDirectDto) {
        try {
            if (user.sub == dto.user_sender) {
                let sender = await this.db.user.findUnique( {
                    where: {
                        id: dto.user_sender
                    }    
                })
                let recipient = await this.db.user.findUnique( {
                    where: {
                        id: dto.user_recipient
                    }    
                })

                if (sender && recipient) {
                    let messages = await this.db.message.findMany({
                        where: {
                            OR: [
                                {
                                    senderId: sender.id,
                                    recipientId: recipient.id 
                                },
                                {
                                    senderId: recipient.id,
                                    recipientId: sender.id 
                                }
                            ],
                        },
                        include: {
                            sender: {
                              select: {
                                  ...chatUserSelect
                              }
                            },
                            recipient: {
                              select: {
                                  ...chatUserSelect
                              }
                            },
                        },
                        orderBy: 
                            {
                                createdAt: "asc"
                            }
                        
                    })

                    if (messages) {
                        return {
                            data: {
                                content: messages,
                                ...dto
                            }
                        }
                    }
                } else {
                    throw new ForbiddenException("Invalid ids");
                }
            } else {
                throw new ForbiddenException("It's not your messages!");
            }
        } catch (error) {
            throw error
        }

    }

}
