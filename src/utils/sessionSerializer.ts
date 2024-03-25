import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from 'src/modules/auth/auth.service';

export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): void {
    done(null, user);
  }

  deserializeUser(user: any, done: (err: Error, payload: string) => void): void {
    user ? done(null, user) : done(null, null);
  }
}
