import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GroupDto } from './dto/group.dto';
import { selectUser } from 'src/user/user.service';
import { RecipientType } from '@prisma/client';
import { chatGroupSelect, chatUserSelect } from 'src/chat/select/chat.select';

@Injectable()
export class GroupService {
    constructor (private readonly db: DatabaseService) {}

    async createGroup(adminId: string, dto: GroupDto) {
        try {
            let admin = this.db.user.findUnique({
                where: {
                    id: adminId
                }
            })

            if (admin) {
                let members = await this.db.user.findMany({
                    where: {
                        id: {
                            in: dto.members
                        }
                    },
                    // select: {
                        // ...selectUser
                    // }
                })

                if (members.length == dto.members.length) {
                    let group = await this.db.group.create({
                        data: {
                            title: dto.title,
                            membersId: dto.members,
                            adminId: adminId
                        },
                        include: {
                            members: {
                                select: {
                                    ...selectUser
                                }
                            },
                            admin: {
                                select: {
                                    ...selectUser
                                }
                            }
                        }
                    })

                    if (group) {
                        return {
                            data: group
                        }

                    } else {
                        throw new ForbiddenException("Error occured during group creation!")
                    }
                } else {
                    throw new ForbiddenException("Some of selected members don't exist!")
                }
            } else {
                throw new ForbiddenException("Your account doesn't exist!")
            }
        } catch (error) {
            console.log(error)

            throw error
        }
    }

    async getMyGroups(userId: string) {
        try {
            let user = await this.db.user.findUnique({
                where: {
                    id: userId
                }
            })

            if (user) {
                let groups = await this.db.group.findMany({
                    where: {
                        OR: [
                                {
                                    adminId: userId
                                }, 
                                {
                                    membersId: {
                                        has: userId
                                }
                            }
                        ]
                    },
                    select: {
                        id: true,
                        title: true,
                        membersId: true,
                        adminId: true,
                    },
                    orderBy: {
                        updatedAt: "desc"
                    }
                })

                if (groups) {
                    return {
                        data: groups
                    }

                } else {
                    throw new NotFoundException("Groups don't exist");
                }

                console.log(groups)
            } else {

                throw new NotFoundException("Your account don't exist");
            }
        } catch (error) {
            throw error
        }

    }

    async getGroup(userId: string, groupId: string) {
        try {
            let user = await this.db.user.findUnique({
                where: {
                    id: userId
                }
            })

            if (user) {
                let group = await this.db.group.findUnique({
                    where: {
                        id: groupId,
                        OR: [{
                            adminId: userId
                        }, 
                        {
                            membersId: {
                                has: userId
                            }
                        }]
                    },
                    select: {
                        id: true,
                        title: true,
                        membersId: true,
                        adminId: true,
                        admin: {
                            select: {
                                ...selectUser
                            }
                        },
                        members: {
                            select: {
                                ...selectUser
                            }
                        }
                    }
                })

                if (group) {
                    return {
                        data: group
                    }
                } else {
                    throw new NotFoundException("You don't member of the group");
                }
            } else {

                throw new NotFoundException("Your account don't exist");
            }
        } catch (error) {
            throw error
        }
    }

    async getGroupMembers(userId: string, groupId: string) {
        try {
            let user = await this.db.user.findUnique({
                where: {
                    id: userId
                }
            })

            if (user) {
                let group = await this.db.group.findUnique({
                    where: {
                        id: groupId,
                        OR: [
                            {
                                adminId: userId
                            }, 
                            {
                                membersId: {
                                    has: userId
                                }
                            }
                        ]
                    }
                })
                if (group) {                  
                    let groupMembers = await this.db.user.findMany({
                        where: {
                            groupMemberId: {
                                has: groupId 
                            }
                        },
                        select: {
                            ...selectUser
                        }
                    })

                    let groupAdmin = await this.db.user.findFirst({
                        where: {
                            groupAdmin: {
                                some: {
                                    id: groupId
                                }
                            }
                        },
                        select: {
                            ...selectUser
                        }
                    })

                    if (groupMembers && groupAdmin) {
                        return {
                            data: [...groupMembers, {...groupAdmin, admin: true}]
                        }
                    } else {
                        throw new NotFoundException("There is no members in this group");
                    }
                } else {
                    throw new NotFoundException("You don't member of the group");
                }
            } else {
                throw new NotFoundException("Your account don't exist");
            }
        } catch (error) {
            throw error
        }
    }

    async getGroupMessages(userId: string, groupId: string) {
        try {
            let user = await this.db.user.findUnique({
                where: {
                    id: userId
                },
            })

            if (user) {
                let group = await this.db.group.findUnique({
                    where: {
                        id: groupId,
                        OR: [{
                            adminId: userId
                        }, 
                        {
                            membersId: {
                                has: userId
                            }
                        }]
                    }
                })

                if (group) {
                    
                let messages = await this.db.message.findMany({
                    where: {
                        recipientGroupId: groupId,
                        recipientType: RecipientType.GROUP
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
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                })

                if (messages) {
                    return {
                        data: messages
                    }
                } else {
                    throw new NotFoundException("Messsages don't exist");
                }

                } else {
                    throw new NotFoundException("You are not in the group");
                }
            } else {
                throw new NotFoundException("Your account don't exist");
            }
        } catch (error) {
            throw error
        }
    }
}
