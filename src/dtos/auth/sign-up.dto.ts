import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @Length(8, 20, { message: 'Password must be between 8-20 characters' })
  password: string;

  @IsNotEmpty({ message: 'Please provide your first name' })
  firstName: string;

  @IsNotEmpty({ message: 'Please provide your last name' })
  lastName: string;
}
