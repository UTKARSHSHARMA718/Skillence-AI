import { CandidateProfile } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @Length(5, 255)
  email: string;

  @IsEnum(CandidateProfile)
  profile: CandidateProfile;

  @IsOptional()
  @Length(2, 255)
  @IsString()
  name?: string;
}
