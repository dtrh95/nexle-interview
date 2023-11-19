import { Request, Response } from 'express';
import { Service } from 'typedi';
import { Controller } from '../decorators/controller.decorator';
import { Middlewares } from '../decorators/middlewares.decorator';
import { Post } from '../decorators/post.decorator';
import { ISignInResponse } from '../interfaces/sign-in-response.interface';
import { ISignUpResponse } from '../interfaces/sign-up-response.interface';
import { signInValidator } from '../middlewares/sign-in-validator';
import { signUpValidator } from '../middlewares/sign-up-validator';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { IRefreshTokenResponse } from '@interfaces/refresh-token-response.interface';

@Controller('')
@Service()
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Middlewares(signUpValidator)
  @Post('/sign-up')
  async signUp(
    req: Request,
    res: Response,
  ): Promise<Response<ISignUpResponse>> {
    try {
      return res.json({ ...(await this.authService.signUp(req.body)) });
    } catch (error) {
      console.error('error:', (error as any).code);
      return res.status(500).send((error as Error).message);
    }
  }

  @Middlewares(signInValidator)
  @Post('/sign-in')
  async signIn(
    req: Request,
    res: Response,
  ): Promise<Response<ISignInResponse>> {
    const { email, password } = req.body;
    try {
      const user = await this.authService.signIn(email, password);
      const savedRefreshToken = await this.tokenService.createRefreshToken({
        userId: user.id,
      });
      const token = this.tokenService.generateToken({ userId: user.id });

      return res.json({
        user,
        token,
        refreshToken: savedRefreshToken?.refreshToken,
      });
    } catch (error) {
      return res.status(500).send((error as Error).message);
    }
  }

  @Post('/sign-out')
  async signOut(req: Request, res: Response): Promise<Response> {
    await this.authService.signOut(req.auth?.userId);
    return res.status(204).send('OK');
  }

  @Post('/refresh-token')
  async refreshToken(
    req: Request,
    res: Response,
  ): Promise<Response<IRefreshTokenResponse>> {
    try {
      const { token, refreshToken } = await this.authService.refreshToken(
        req.auth?.userId,
        req.headers?.authorization?.split(' ')[1],
      );

      return res.status(200).json({ token, refreshToken });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === AuthService.TOKEN_NOT_FOUND_CODE
      ) {
        return res.status(404).send('Token not found');
      }

      return res.status(500);
    }
  }
}
