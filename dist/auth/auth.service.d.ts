import { LoginDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../users/user.repository';
export declare class AuthService {
    private userRepository;
    private jwtService;
    private logger;
    constructor(userRepository: UserRepository, jwtService: JwtService);
    signIn(loginDto: LoginDto): Promise<{
        accessToken: string;
    }>;
}
