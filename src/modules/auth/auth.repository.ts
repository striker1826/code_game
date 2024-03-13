import { User } from 'src/entities/user.entity';
import { UserDto } from './dto/user.dto';

export interface AuthRepository {
  saveUser(user: UserDto): Promise<User>;
  findUserByUsername(username: string): Promise<User>;
}

export const AuthRepository = Symbol('AuthRepository');
