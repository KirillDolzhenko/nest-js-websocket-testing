import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { JWTUserDto, LogInUserDto, SettingsUserDto, UserDto } from './dto/user.dto';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { NotFoundError } from 'rxjs';

let selectUser = {
    id: true,
    username: true,
    email: true,
    picColor: true,
    picUrl: true
};

export function ObjectId(id: string) {
    return {
        $oid: id
    }
}

@Injectable()
export class UserService {
    constructor(
        private readonly db: DatabaseService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) {}

    async jwtAccessToken (id: string) {
        let secret = this.config.get("jwt.secret.access");

        return await this.jwt.signAsync({
            sub: id
        }, {
            secret,
            expiresIn: "10min"
        })
    }

    async jwtRefreshToken (id: string) {
        let secret = this.config.get("jwt.secret.refresh");

console.log("ID - ", id)

        return await this.jwt.signAsync({
            sub: id
        }, {
            secret,
            expiresIn: "60d"
        })
    }

    async jwtTokens (id: string): Promise<{
        access_token: string,
        refresh_token: string
    }> {
        return {
            access_token: await this.jwtAccessToken(id),
            refresh_token: await this.jwtRefreshToken(id)
        }
    }

    async jwtTokensAppend (data: any, id: string, response: Response) {
        
        let tokens = await this.jwtTokens(id);

        response.cookie("refresh_token", tokens.refresh_token, {
         httpOnly: true, 
         secure: true,
         maxAge: 1000 * 60 * 60 * 24 * 60
        })

        return {
             data: {
                ...data,
                 tokens
             }
        }
    }

    async clearRefreshToken (response: Response) {
        response.cookie("refresh_token", "", {
         httpOnly: true, 
         secure: true,
         maxAge: 1
        })
    }

    async createUser(data: UserDto, response: Response) { 
        try {
            const passwordHash = await bcrypt.hash(data.password, 10);

            let userCurrent = await this.db.user.findUnique({
                where: {
                 email: data.email,
                }
            })

            if (!userCurrent) {

                let user = await this.db.user.create({
                   data: {
                    ...data,
                    password: passwordHash
                   },
                   select: selectUser
               })
    
               return await this.jwtTokensAppend({user}, user.id, response)            
            } else {
                throw new ForbiddenException("Данные заняты")
            }
        } catch (error) {
            throw error            
        }
    }

    async logIn(data: LogInUserDto, response: Response) {
        try {
            let user = await this.db.user.findUnique({
               where: {
                email: data.email,
               },
               select: {
                    ...selectUser,
                    password: true
               }
            })
            
            if (user) {
                if (await bcrypt.compare(data.password, user.password)) {
                    delete user.password;

                    return await this.jwtTokensAppend({user}, user.id, response);
                }                 
            } 


            throw new ForbiddenException("Неверные данные")
        } catch (error) {
            throw error            
        }
    }
    
    async logOut(id: string, response: Response) {
        try {
            let user = await this.db.user.findUnique({
               where: {
                id,
               }
            })
            
            if (user) {
                await this.clearRefreshToken(response);

                return {
                    data: {
                        success: true
                    }
                };          
            } 

            throw new ForbiddenException("Неверные данные")
        } catch (error) {
            throw error            
        }
    }

    async refreshToken(id: string, response: Response) {
        try {
            let user = await this.db.user.findUnique({
                where: {
                    id
                }
            })

            if (user) {
                return await this.jwtTokensAppend({}, user.id, response)
            } else {
                throw new ForbiddenException("Токен недействительный") 
            }
        } catch (error) {
            throw error
        }
    }

    async getUser(id: string) {
        try {
            let user = await this.db.user.findUnique({
                where: {
                    id
                },
                select: selectUser
            })

            if (user) {
                return {
                    data: {
                        user
                    }
                }

            } else {
                throw new NotFoundError("Пользователь не найден") 
            }
             
        } catch (error) {
            
        }
    }

    async authMe(id: string, response: Response) {
        try {
            let user = await this.db.user.findUnique({
                where: {
                    id
                },
                select: selectUser
            })

            if (user) {
                return await this.jwtTokensAppend({user}, user.id, response)

            } else {
                throw new NotFoundError("Пользователь не найден") 
            }
             
        } catch (error) {
            
        }
    }

    async patchInfo(data: SettingsUserDto, id: string) {
        try {
            let user = await this.db.user.findUnique({
                where: {
                    id
                }
            })

            console.log(data)

            if (user) {
                if (user.id == id) {
                    let userUpdated = await this.db.user.update({
                        where: {
                            id
                        },
                        data,
                        select: selectUser
                    })

                
                    console.log(userUpdated)
                
                    return {
                        data: {
                            user: userUpdated
                        }
                    }
                } else {
                    throw new ForbiddenException("Вы не можете редактировать чужой профиль")
                }
            } else {
                throw new NotFoundError("Пользователь не найден")
            }
        } catch (error) {
            throw error
        }
    }

    async removeProfilePic(id: string) {
        try {
            let user = await this.db.user.findUnique({
                where: {
                    id
                }
            })

            if (user) {
                let userUpdated = await this.db.user.update({
                    where: {
                        id
                    },
                    data: {
                        picUrl: ""
                    },
                    select: selectUser
                })
            
                console.log(userUpdated)
            
                return {
                    data: {
                        user: userUpdated
                    }
                }
            } else {
                throw new NotFoundError("Пользователь не найден")
            }
        } catch (error) {
            throw error
        }
    }

    async searchUsers(id: string, query: string) {
        try {
            let users = await this.db.user.aggregateRaw({
                pipeline: [{
                    $match: {
                        username: {
                            $regex: `.?${query}.?`,
                            $options: "ui"
                        },
                        
                    } 
                },{
                    $match: {
                        _id: {
                            $ne: ObjectId(id),
                        },
                    } 
                },
                    { 
                        $project: {
                            _id: false,
                            id: {
                                $toString: "$_id"
                            },
                            username: true,
                            
                            picColor: true,
                            picUrl: true,
                            email: true
                        }
                    },
                    {$limit: 7}
                ],

            })

            if (users.length) {
                return {
                    data: users
                }
            } 
            else {
                throw new NotFoundException("Users not found")
            }
        } catch (error) {
            console.log(error)

            throw error
        }

    }
}