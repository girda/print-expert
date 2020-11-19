import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {IUser} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService implements IUser {
  login;
  password;
  id;
  role;
  filters = null;
  client;

  constructor(private http: HttpClient) {}

  getRole(): number {
    return this.role;
  }

  setRole(role: number): void {
    this.role = role;
  }

  getClient(): number {
    return this.client;
  }

  setClient(client: number): void {
    this.client = client;
  }

  getUserId(): number {
    return this.id;
  }

  setUserId(id: number): void {
    this.id = id;
  }

  getFilters(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/filters/${this.id}`);
  }

  setFilters(filters: any, userId: number): Observable<any> {
    this.filters = filters;
    return this.http.patch<any>(`${environment.apiUrl}/api/filters/${userId}`, filters);
  }

  getAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${environment.apiUrl}/api/users`);
  }

  create(user: IUser): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/users`, user);
  }
}
