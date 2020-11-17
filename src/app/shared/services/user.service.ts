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
  filters;

  constructor(private http: HttpClient) {}

  getRole(): string {
    return this.role;
  }

  setRole(role: string): void {
    this.role = role;
  }

  getUserId(): number {
    return this.id;
  }

  setUserId(id: string): void {
    this.id = id;
  }

  getFilters(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/filters/${this.id}`);
  }

  setFilters(filters: any, userId: number): Observable<any> {
    this.filters = filters;
    return this.http.patch<any>(`${environment.apiUrl}/api/filters/${userId}`, filters);
  }
}
