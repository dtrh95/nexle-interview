export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  hash: string;
  updatedAt: Date;
  createdAt: Date;
}
