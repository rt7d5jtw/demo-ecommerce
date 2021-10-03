import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signIn(loginDto: LoginDto): Promise<{
        accessToken: string;
    }>;
}
