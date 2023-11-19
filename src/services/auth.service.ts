import { SignUpDto } from '@dtos/auth/sign-up.dto';
import { ISignUpResponse } from '@interfaces/sign-up-response.interface';
import { User } from '@models/user.model';
import { UserRepository } from '@repositories/user.repository';
import bcrypt from 'bcrypt';
import { Service } from 'typedi';

@Service()
export class AuthService {
  public static PASSWORD_SALT = 10;
  public static USER_NOT_FOUND_CODE = '1';

  constructor(private userRepository: UserRepository) {}
  async signUp(dto: SignUpDto): Promise<ISignUpResponse> {
    const { password } = dto;
    const hashedPassword = await bcrypt.hash(
      password,
      AuthService.PASSWORD_SALT,
    );

    try {
      const rawUser = await this.userRepository.insert({
        ...dto,
        password: hashedPassword,
        hash: hashedPassword,
        updatedAt: new Date(),
      });

      if (!rawUser) {
        throw new Error('User was not created');
      }

      const { firstName, lastName } = rawUser;

      return {
        id: rawUser.id,
        lastName: rawUser.lastName,
        firstName: rawUser.firstName,
        email: rawUser.email,
        displayName: `${firstName} ${lastName}`,
      };
    } catch (error: unknown) {
      if ((error as any).errno === 1062) {
        throw Error('User has already existed');
      }

      if ((error as any).errno) {
        throw Error((error as any).sqlMessage);
      }

      throw Error((error as Error).message);
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw Error('User not found');
    }

    if (!bcrypt.compareSync(password, user.hash)) {
      throw Error('Your email or password is not valid');
    }

    return user;
  }
}
