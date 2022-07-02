import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(private jwtService: JwtService, private usersService: UsersService) {}

  /**
   * @see {@link https://datatracker.ietf.org/doc/html/rfc7519|JWTrfc}
   *
   * Signs the user in by calling {@link UsersService.validateUserPassword}
   * and {@link JwtService.sign}, returns the JWT token.
   *
   * @param {LoginDto} loginDto - The email and password of the {@link User}
   * @returns {Promise<{ accessToken: string }>} Access token for the JWT
   */
  async signIn(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const email = await this.usersService.validateUserPassword(loginDto);

    if (!email)
      throw new UnauthorizedException('Invalid credentials, email was not provided or found');

    const accessToken = this.jwtService.sign(email); // Signs and encrypts the signature
    this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(email)}`);

    return { accessToken };
  }
}
