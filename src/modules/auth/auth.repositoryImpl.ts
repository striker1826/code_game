import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(@InjectRepository(User) private readonly userModel: Repository<User>) {}

  async saveUser({ id, username, profileUrl }: UserDto): Promise<User> {
    const newUser = this.userModel.create();
    newUser.nickname = username;
    newUser.profileUrl = profileUrl;
    newUser.tierId = 1;
    const createdUser = await this.userModel.save(newUser);
    return createdUser;
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { nickname: username } });
    return user;
  }
}
