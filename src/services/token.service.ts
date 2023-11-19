import { CreateTokenDto } from '../dtos/token/create-token.dto';
import { Token } from '../models/token.model';
import { TokenRepository } from '../repositories/token.repository';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';

@Service()
export class TokenService {
  constructor(private tokenRepository: TokenRepository) {}

  async createRefreshToken(dto: CreateTokenDto): Promise<Token | undefined> {
    const { JWT_REFRESH_TOKEN_EXPIRATION_TIME, JWT_SECRET } = process.env;

    if (!JWT_SECRET) {
      throw Error('The secret key is not existed');
    }

    const refreshToken = sign({ userId: dto.userId }, JWT_SECRET, {
      expiresIn: `${JWT_REFRESH_TOKEN_EXPIRATION_TIME}s`,
    });

    return await this.tokenRepository.insert({
      userId: dto.userId,
      refreshToken,
      updatedAt: new Date(),
    });
  }

  generateToken(dto: CreateTokenDto): string {
    const { JWT_ACCESS_TOKEN_EXPIRATION_TIME, JWT_SECRET } = process.env;

    if (!JWT_SECRET) {
      throw Error('The secret key is not existed');
    }

    const accessToken = sign({ userId: dto.userId }, JWT_SECRET, {
      expiresIn: `${JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
    });

    return accessToken;
  }
}
