import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, UniqueConstraintError } from 'sequelize';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async findOne(options: FindOptions) {
    const user = await this.userRepository.findOne<User>(options);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { id, name, email } = await this.userRepository.create<User>(
        { ...createUserDto },
        { raw: true },
      );

      return { id, name, email };
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new BadRequestException(`${error.errors[0].path} must be unique`);
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }
}
