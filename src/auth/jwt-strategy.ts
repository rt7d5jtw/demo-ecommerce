import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${process.env.SECRET}`,
    });
  }

  /**
   * Validates the user by searching for the user by the email in the payload. If user is found, user is returned.
   * @param {JwtPayload} payload - Email of the {@link User}
   * @returns {Promise<User>} returns the validated User.
   */
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: payload['email'] } });
    if (!user) throw new UnauthorizedException(`User could not be found`);
    return user;
  }
}
