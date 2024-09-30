import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { Socket } from "socket.io";
import sendError from "src/chat/functions/chat.functions";

export class JwtAccessGuard extends AuthGuard("jwt-access") {}

@Injectable()
export class JwtAccessSocketGuard implements CanActivate {

    constructor(private readonly jwt: JwtService, private readonly config: ConfigService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const client: Socket = context.switchToWs().getClient<Socket>();
        const data: any = context.switchToWs().getData();

        let token = data.auth.token;

        try {
            const payload = this.jwt.verify(token, {
                secret: this.config.get("jwt.secret.access")
              }); // Валидация токена

            return true;
        } catch (e) {
            sendError(client, "Invalid token", data);
            throw new UnauthorizedException('Invalid token');
        }
    }
}
 