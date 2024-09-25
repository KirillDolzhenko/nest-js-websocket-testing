import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ConfigGlobalModule } from './config/config.module';
import { JwtGlobalModule } from './jwt/jwt.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { DirectChatService } from './chat/services/direct.chat.service';
import { ChatModule } from './chat/chat.module';
import { GroupModule } from './group/group.module';


@Module({
  controllers: [AppController],
  providers: [AppService, ChatGateway, DirectChatService],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', "..", "uploads"),
      serveRoot: "/static"
    }),
    DatabaseModule, UserModule, ConfigGlobalModule, JwtGlobalModule, FilesModule, ChatModule, GroupModule],

})
export class AppModule {}
