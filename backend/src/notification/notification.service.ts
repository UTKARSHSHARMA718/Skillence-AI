import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NotificationService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, body: string) {
    if(!to || !subject || !body) {
      throw new Error('Missing required email parameters');
    }
    // Implement email sending logic here using a service like SendGrid, SES, etc.
    console.log(
      `Sending email to ${to} with subject "${subject}" and body "${body}"`,
    );
    
    return this.mailerService.sendMail({
      to,
      subject,
      text: body,
    });
  }
}
