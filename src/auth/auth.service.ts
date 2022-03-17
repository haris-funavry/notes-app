import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne({
      where: { email: email },
      attributes: { include: ['password'] },
      raw: true,
    });

    if (await compare(password, user.password)) {
      const { password, ...result } = user;
      return result as User;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
