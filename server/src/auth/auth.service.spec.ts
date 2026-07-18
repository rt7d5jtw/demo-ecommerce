import { Test } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import * as Testdata from '../../test/testdata.json';

describe('AuthService', () => {
  let jwtService: JwtService;
  let usersService: UsersService;
  let authService: AuthService;

  const mockUserRepository = () => ({
    findOne: jest.fn()
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        UsersService,
        AuthService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository
        }
      ]
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('Signs the user in by calling UsersService.validateUserPassword and JwtService.sign, finally returns the JWT token', async () => {
      const loginDto = Testdata.loginDto; // Import data from testing data json
      jest
        .spyOn(usersService, 'validateUserPassword')
        .mockResolvedValue(loginDto['email']);
      // JwtService uses node-jsonwebtoken for JWT implementation
      jest
        .spyOn(jwtService, 'sign')
        .mockImplementation(() => jwt.sign(loginDto['email'], 'supasekret')); // Calls to jwt.sign function using node-jsonwebtoken

      // toMatch is set to regex of JWT Token
      const result = await authService.signIn(loginDto);
      expect(result).toEqual({ accessToken: expect.any(String) });
      expect(result.accessToken).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
      );
      expect(usersService.validateUserPassword).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });
});
