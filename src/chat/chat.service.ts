import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { JWTUserDto } from 'src/user/dto/user.dto';
import { GetMessagesDirectDto } from './dto/chat.dto';
import { chatUserSelect } from './select/chat.select';
import { ObjectId } from 'src/user/user.service';

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
    
    async getContactsDirect(user: JWTUserDto) {
        try {
            let userDB = await this.db.user.findUnique({
                where: {
                    id: user.sub
                }
            })


            if (userDB) {
                let contacts = await this.db.message.aggregateRaw({
                    pipeline: [
                        {
                            $match: {
                                $or: [{
                                    senderId: {$eq: ObjectId(user.sub)}
                                }, {
                                    recipientId: {$eq: ObjectId(user.sub)}
                                }]
                            }
                        },
                        {
                            $sort: {
                                createdAt: -1
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    $cond: {
                                        if: {
                                            $eq: ["$senderId", ObjectId(user.sub)]
                                        },
                                        then: "$recipientId",
                                        else: "$senderId"
                                    }
                                },
                                lastMessage: {
                                    $first: "$content"
                                }
                            }                            
                        },
                        {
                            $lookup: {
                                from: "User",
                                localField: "_id",
                                foreignField: "_id",
                                as: "user"
                            }
                        },
                        {
                            $project: {
                                lastMessage: "$lastMessage",
                                user: { 
                                    $arrayElemAt: ['$user',0]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                lastMessage: "$lastMessage",
                                user: {
                                    id: {
                                        $toString: "$user._id"
                                    },
                                    username: 1,
                                    email: 1,
                                    picUrl: 1,
                                    picColor: 1
                                }
                            }
                        }

                    ]
                }) 

                if (contacts) {
                    return {
                        data: contacts
                    }
                } else {
                    throw new ForbiddenException("There is no contacts"); 
                }
            } else {
                throw new ForbiddenException("Your account didn't exist"); 
            }
        } catch (error) {
            console.log(error)
        }

    }

}
