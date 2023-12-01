import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';


import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from '../common/guards/jwt.strategy';
import { LocalStrategy } from '../common/guards/local.strategy';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      //imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.APP_API_SECRET,
        signOptions: { expiresIn: '12h' },
      }),
      //inject: [ConfigService],
    }),
    PassportModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    MailService,
    LocalStrategy,
    JwtStrategy
  ],
  //exports: [AuthService],
})
export class AuthModule { }
