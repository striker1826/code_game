import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  private logger: Logger = new Logger(WsJwtGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const authToken = client.handshake.headers.authorization.split(' ')[1];

      console.log(authToken);
      const user = await this.jwtService.verify(authToken, { secret: process.env.ACCESS_TOKEN_SECRET });
      client.data.nickname = user.nickname;
      client.data.userId = user.userId;
      client.data.profileUrl = user.profileUrl;

      return true;
    } catch (err) {
      throw new WsException(err.message);
    }
  }
}
