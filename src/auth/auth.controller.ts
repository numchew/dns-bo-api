import { Controller, Request, Post, UseGuards, Body, Param, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guards/local.strategy';
import { JwtAuthGuard } from '../common/guards/jwt.strategy';
import { User } from '../common/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() newUser: any) {
    return this.authService.register(newUser.username, newUser.password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/profile')
  updateProfile(@Param('id') id: string, @Body() newUser: User) {
    return this.authService.updateProfile(+id, newUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/profile')
  getProfile(@Param('id') id: string) {
    return this.authService.getProfile(+id);
  }

  //--------------------------------------------------//
  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  resetPassword(
    @Body() body: { username: string, password: string },
  ) {
    return this.authService.resetPassword(body.username, body.password);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: { username: string }) {
    return this.authService.forgotPassword(body.username);
  }

  //--------------------------------------------------//
}
