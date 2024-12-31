import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {

  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('email.host'),
      port: this.configService.get<number>('email.port'),
      secure: this.configService.get<boolean>('email.secure'), 
      auth: {
        user: this.configService.get<string>('email.auth.user'),
        pass: this.configService.get<string>('email.auth.pass'),
      },
    });
  }


  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Therapist App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
  }

}
