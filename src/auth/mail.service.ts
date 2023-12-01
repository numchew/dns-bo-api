import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    constructor() {
        // Configure your email service provider settings
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
        });
    }

    async sendPasswordResetOTP(email: string, otp: string): Promise<boolean> {
        const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`,
        };

        try {
            console.log(`Password reset OTP sent to email: ${email}`);
            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error(`Failed to send password reset OTP to email: ${email}`);
            throw new Error('Failed to send password reset OTP');
        }
    }
}
