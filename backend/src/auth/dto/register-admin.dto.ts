import { IsEmail, IsString, Length } from "class-validator";

export class RegisterAdminDto {
    @IsEmail()
    @Length(5, 255)
    email: string;
    
    @IsString()
    @Length(2, 255)
    name: string;

    @IsString()
    @Length(6, 12)
    password: string;
}