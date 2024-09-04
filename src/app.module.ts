import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ConfigGlobalModule } from './config/config.module';
import { JwtGlobalModule } from './jwt/jwt.module';

@Module({
  controllers: [AppController],
  providers: [AppService, ChatGateway],
  imports: [DatabaseModule, UserModule, ConfigGlobalModule, JwtGlobalModule],

})
export class AppModule {}
