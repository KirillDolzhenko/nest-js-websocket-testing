import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { Socket } from "socket.io";

export class JwtAccessGuard extends AuthGuard("jwt-access") {}

@Injectable()
export class JwtAccessSocketGuard implements CanActivate {

    constructor(private readonly jwt: JwtService, private readonly config: ConfigService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const client: Socket = context.switchToWs().getClient<Socket>();

        let token = client.handshake.headers?.auth || client.handshake.auth?.token;

        try {
            const payload = this.jwt.verify(token, {
                secret: this.config.get("jwt.secret.access")
              }); // Валидация токена

            return true;
        } catch (e) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
 