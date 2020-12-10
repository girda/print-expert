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
