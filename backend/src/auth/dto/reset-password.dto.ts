import { IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @Length(1, 500)
  token: string;

  @IsString()
  @Length(6, 20)
  newPassword: string;
}
