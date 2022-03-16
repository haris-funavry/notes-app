import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UniqueConstraintError } from 'sequelize';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    try {
      await this.userRepository.create<User>({ ...createUserDto });
      return;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new BadRequestException(`${error.errors[0].path} must be unique`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
