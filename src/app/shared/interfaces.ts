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

export interface IDropdown {
  id?: number;
  name: string;
}

export interface IClient {
  id?: number;
  name: string;
  active?: boolean;
}

export interface IConnectionCWW {
  ip: string;
  login: string;
  pswd: string;
  client_id: number;
  id?: number;
  status: number;
  active?: boolean;
}

export interface ILocation {
  id?: number;
  name: string;
  client_id?: number;
  cwwc_id?: number;
  active?: boolean;
}

export interface IDepartment {
  id?: number;
  name: string;
  location_id?: number;
  client_id?: number;
}

export interface IRewritingPrinters {
  printer_id: number;
  location_name: string;
  department_name: string;
  cwwc_id: number;
  cartridge_resource_bk: string;
  cartridge_resource_cn: string;
  cartridge_resource_mg: string;
  cartridge_resource_yl: string;
}
export interface ITimer {
  id?: number;
  name?: string;
  hh: number;
  mm: number;
  error_status?: number;
  error_descr?: string;
  exec_status?: number;
  period: number;
}

