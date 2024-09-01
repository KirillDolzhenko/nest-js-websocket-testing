import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private readonly db: DatabaseService) {

    }

    async createUser(data: UserDto) {
        
        
        try {
            let user = await this.db.user.create({
               data
           })

           return {
            data: user
           }
            
        } catch (error) {
            throw error            
        }



    }
}
