import { IsEmail, Length } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;
  @Length(8, 20, { message: 'Password must be between 8-20 characters' })
  password: string;
}
