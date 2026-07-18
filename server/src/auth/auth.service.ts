import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
//import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  /**
   * @see {@link https://datatracker.ietf.org/doc/html/rfc7519|JWTrfc}
   *
   * Signs the user in by calling {@linkcode UsersService validateUserPassword}
   * and {@linkcode JwtService sign}, returns the JWT token.
   *
   * @param {LoginDto} loginDto - The email and password of the User.
   * @returns {Promise<{ accessToken: string }>} Access token for the JWT.
   */
  async signIn(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const email = await this.usersService.validateUserPassword(loginDto);

    if (!email)
      throw new UnauthorizedException(
        'Invalid credentials, email was not provided or found'
      );

    this.logger.debug(
      `Email that got back from validateUserPassword -> ${email}`
    );

    // Signs and encrypts the signature
    // @see {@link https://github.com/nestjs/jwt/blob/master/lib/jwt.service.ts#L33}
    const accessToken = this.jwtService.sign(
      { email: email },
      { secret: process.env.JWT_SECRET }
    );

    // Backup to use jsonwebtoken library directly incase @nestJS/jwt breaks again.
    // NOTE: Token verification will have to be replaced if you do this manually!
    // Signs and encrypts the signature using HS256 by default
    //const accessToken = jwt.sign({ email: email }, process.env.JWT_SECRET, {
    //  expiresIn: '1h'
    //});

    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(email)}`
    );

    return { accessToken };
  }
}
