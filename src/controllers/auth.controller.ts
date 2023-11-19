import { Controller } from '@decorators/controller.decorator';
import { Middlewares } from '@decorators/middlewares.decorator';
import { Post } from '@decorators/post.decorator';
import { ISignUpResponse } from '@interfaces/sign-up-response.interface';
import { signInValidator } from '@middlewares/sign-in-validator';
import { signUpValidator } from '@middlewares/sign-up-validator';
import { AuthService } from '@services/auth.service';
import { TokenService } from '@services/token.service';
import { Request, Response } from 'express';
import { Service } from 'typedi';

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
  ): Promise<Response<{ data: string }>> {
    const { email, password } = req.body;
    try {
      const user = await this.authService.signIn(email, password);
      const savedRefreshToken = await this.tokenService.createRefreshToken({
        userId: user.id,
      });
      const accessToken = this.tokenService.generateToken({ userId: user.id });

      return res.json({
        user,
        refreshToken: savedRefreshToken,
        accessToken,
      });
    } catch (error) {
      return res.status(500).send((error as Error).message);
    }
  }
}
