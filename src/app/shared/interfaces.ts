export interface IUser {
  email: string;
  password: string;
}

export interface IDropdown {
  id?: number;
  name: string;
}

export interface IClient {
  id?: number;
  name: string;
}

export interface IConnectionCWW {
  ip: string;
  login: string;
  pswd: string;
  client_id: number;
  id?: number;
  status: number;
}

export interface ILocation {
  id?: number;
  name: string;
  client_id: number;
  cwwc_id: number;
}

export interface IDepartment {
  id?: number;
  name: string;
  location_id?: number;
  client_id?: number;
}
