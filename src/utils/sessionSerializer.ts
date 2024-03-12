import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from 'src/modules/auth/auth.service';

export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): void {
    console.log('serializeUser');
    done(null, user);
  }

  deserializeUser(user: any, done: (err: Error, payload: string) => void): void {
    console.log('deserializeUser');
    user ? done(null, user) : done(null, null);
  }
}
