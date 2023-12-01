import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { MailService } from './mail.service';
import { User } from '../common/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

  ///////////////////////////////////////////////////////
  isValidEmail(email: string) {
    if (email) {
      var re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    } else return false;
  }
  ///////////////////////////////////////////////////////
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (user && (await bcrypt.compare(password, user.password) || user.reset_password === password)) {
      const { password, reset_password, ...result } = user;
      return result;
    }
    return null;
  }

  createToken(user: any) {
    return { email: user.email, sub: user.id, role: user.role };
  }

  //--------------------------------------------------//
  //--------------------------------------------------//
  async register(email: string, password: string) {
    if (!this.isValidEmail(email)) {  //อักขระ email ไม่ถูก
      throw new UnauthorizedException('Please register with email.');
    }
    const pass = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
    const user = await this.usersService.create(email, pass);
    return this.login(user);
  }

  async login(user: any) {
    const payload = this.createToken(user);
    return { access_token: this.jwtService.sign(payload), };
  }

  async updateProfile(id: number, data: Partial<User>) {
    const user = await this.usersService.update(id, data);
    return user;
  }

  async getProfile(id: number) {
    return await this.usersService.findOne(id);
  }

  generateResetToken(userId: number): string {
    const payload = { userId };
    return this.jwtService.sign(payload, { expiresIn: '1m' });
  }
  //--------------------------------------------------//
  //--------------------------------------------------//
  async resetPassword(email: string, newPassword: string): Promise<void> {
    // Find the user with the provided reset token
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Invalid or expired reset token.');
    }

    // Update the user's password and reset token
    const pass = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_SALT));
    user.password = pass;
    user.reset_password = null;
    await this.usersService.update(user.id, user);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      // Generate a secure reset token
      const reset_password = generateOTP();
      // Save the reset token and its associated user to the database
      await this.usersService.update(user.id, { reset_password: reset_password });
      setTimeout(async () => {
        await this.usersService.update(user.id, { reset_password: '' });
      }, 15 * 60 * 1000);
      // Send OTP to email address
      return await this.mailService.sendPasswordResetOTP(email, reset_password);
    }
    return false; /* */

    //console.log(this.generateResetToken(user.id));

  }
  //--------------------------------------------------//
  //--------------------------------------------------//
}


function generateOTP(): string {
  // Generate a random six-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  //const otp = randomBytes(20).toString('hex');
  return otp;
}
