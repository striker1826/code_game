import { UserDto } from './dto/user.dto';

export interface AuthRepository {
  saveUser(user: UserDto): Promise<void>;
}

export const AuthRepository = Symbol('AuthRepository');
