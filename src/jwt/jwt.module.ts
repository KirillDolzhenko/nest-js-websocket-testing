import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Global()
@Module({
    imports: [JwtModule],
    exports: [JwtModule]
})
export class JwtGlobalModule {}