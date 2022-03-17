import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // custom token validation
  handleRequest(err, user, info) {
    // info object contains information about the error if token was invalid/absent etc
    if (info) {
      switch (true) {
        case info instanceof JsonWebTokenError:
          throw new UnauthorizedException('Invalid Token');

        default:
          throw new UnauthorizedException('Please check your token');
      }
    } else if (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }

    return user;
  }
}
