import { IRepository } from '@interfaces/repository.interface';
import { User } from '@models/user.model';
import { Database } from '@database';
import { Service } from 'typedi';

@Service()
export class UserRepository implements IRepository<User> {
  constructor(private databaseInstance: Database<User>) {}

  async insert(user: Partial<User>): Promise<User | undefined> {
    const [createdUserId] = await this.databaseInstance
      .getConnection()('users')
      .insert(user);
    return this.findOne(createdUserId);
  }

  async findOne(id: number): Promise<User | undefined> {
    return this.databaseInstance
      .getConnection()('users')
      .where('id', id)
      .first();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.databaseInstance
      .getConnection()('users')
      .where('email', email)
      .first();
  }
}
