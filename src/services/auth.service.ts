import bcrypt from 'bcrypt';
import { Service } from 'typedi';
import { SignUpDto } from '../dtos/auth/sign-up.dto';
import { ISignInResponse } from '../interfaces/sign-in-response.interface';
import { ISignUpResponse } from '../interfaces/sign-up-response.interface';
import { TokenRepository } from '../repositories/token.repository';
import { UserRepository } from '../repositories/user.repository';
import { TokenService } from './token.service';
import { IRefreshTokenResponse } from '../interfaces/refresh-token-response.interface';

@Service()
export class AuthService {
  public static PASSWORD_SALT = 10;
  public static USER_NOT_FOUND_CODE = '1';
  public static TOKEN_NOT_FOUND_CODE = '2';

  constructor(
    private userRepository: UserRepository,
    private tokenRepository: TokenRepository,
    private tokenService: TokenService,
  ) {}
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

  async signIn(email: string, password: string): Promise<ISignInResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw Error('User not found');
    }

    if (!bcrypt.compareSync(password, user.hash)) {
      throw Error('Your email or password is not valid');
    }

    return {
      id: user.id,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
      displayName: `${user.firstName} ${user.lastName}`,
    };
  }

  async signOut(userId: number | undefined): Promise<void> {
    if (!userId) {
      throw new Error('User not found');
    }

    await this.tokenRepository.deleteByUserId(userId);
  }

  async refreshToken(
    userId: number | undefined,
    currentRefreshToken: string | undefined,
  ): Promise<IRefreshTokenResponse> {
    if (!userId) {
      throw new Error('User not found');
    }

    const existedToken =
      await this.tokenRepository.findByToken(currentRefreshToken);

    if (!existedToken) {
      throw new Error(AuthService.TOKEN_NOT_FOUND_CODE);
    }

    const savedRefreshToken = await this.tokenService.createRefreshToken({
      userId,
    });

    if (!savedRefreshToken) {
      throw new Error('Cannot create a new Refresh Token');
    }

    const token = this.tokenService.generateToken({ userId });

    return {
      token,
      refreshToken: savedRefreshToken.refreshToken,
    };
  }
}
