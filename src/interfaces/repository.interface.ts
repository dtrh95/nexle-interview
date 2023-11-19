export interface IRepository<T> {
  findOne?: (id: number) => Promise<T | undefined>;
  findAll?: () => Promise<[number, T[]]>;
  insert?: <P extends Partial<T>>(payload: P) => Promise<T | undefined>;
  delete?: (id: number) => Promise<void>;
}
