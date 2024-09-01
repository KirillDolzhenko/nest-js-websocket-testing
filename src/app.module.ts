import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
// import { ChatModule } from './chat/chat.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';

@Module({
  controllers: [AppController],
  providers: [AppService, ChatGateway],
  imports: [DatabaseModule, UserModule],
})
export class AppModule {}
