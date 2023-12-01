import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.APP_API_SECRET
        });
    }

    async validate(payload: any) {
        return this.authService.createToken(payload);
    }
}