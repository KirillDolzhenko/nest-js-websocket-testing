import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GroupDto } from './dto/group.dto';
import { selectUser } from 'src/user/user.service';

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
}
