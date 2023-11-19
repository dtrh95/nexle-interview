import { Database } from '../database';
import { IRepository } from '../interfaces/repository.interface';
import { Token } from '../models/token.model';
import { Service } from 'typedi';

@Service()
export class TokenRepository implements IRepository<Token> {
  constructor(private databaseInstance: Database<Token>) {}

  async findAllTokenByUserId(userId: number): Promise<Token[]> {
    const connection = this.databaseInstance.getConnection()('tokens');

    return await connection.where('id', userId).select('*');
  }

  async insert(payload: Partial<Token>): Promise<Token | undefined> {
    const [tokenId] = await this.databaseInstance
      .getConnection()('tokens')
      .insert(payload);

    return this.findOne(tokenId);
  }

  async findOne(id: number): Promise<Token | undefined> {
    return this.databaseInstance
      .getConnection()('tokens')
      .where('id', id)
      .first();
  }

  async deleteByUserId(userId: number): Promise<void> {
    const connection = this.databaseInstance.getConnection()('tokens');

    await connection.where('userId', userId).delete();
  }

  async findByToken(token: string | undefined): Promise<Token | undefined> {
    return this.databaseInstance
      .getConnection()('tokens')
      .where('refreshToken', token)
      .first();
  }
}
