import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    console.log('result: ', result);
    const request = context.switchToHttp().getRequest();

    await super.logIn(request);
    return result;
  }
}
