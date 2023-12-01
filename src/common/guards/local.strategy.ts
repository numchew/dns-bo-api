import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') { }

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private service: AuthService) {
        super();
    }
    // (username ที่ส่งมาคือ email)
    async validate(username: string, password: string): Promise<any> {
        const user = await this.service.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException('Invalid username or password.');
        }
        return user;
    }
}