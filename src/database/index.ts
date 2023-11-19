import Knex from 'knex';
import { Service } from 'typedi';
import config from 'knexfile';

@Service()
export class Database<T extends Record<string, any>> {
  private _databaseInstance: Knex.Knex<T, T>;
  constructor() {
    this._databaseInstance = Knex(
      config[process.env.NODE_ENV || 'development'],
    );
  }

  getConnection(): Knex.Knex<T, T> {
    return this._databaseInstance;
  }
}
