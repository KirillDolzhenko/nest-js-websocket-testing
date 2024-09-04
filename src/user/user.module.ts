import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtAccessStrategy } from 'src/jwt/strategies/access.strategy';
import { JwtRefreshStrategy } from 'src/jwt/strategies/refresh.strategy';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class UserModule {}
