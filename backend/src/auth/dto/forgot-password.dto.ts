import { IsEmail, Length } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @Length(5, 255)
  email: string;
}
