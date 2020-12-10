export interface IUser {
  login: string;
  password?: string;
  filters?: string;
  role?: number | string;
  id?: number;
  client?: number | string;
  email?: string;
  name?: string;
}
