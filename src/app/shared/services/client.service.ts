
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IClient, IConnectionCWW, IDepartment, IDropdown, ILocation} from '../interfaces';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ClientService {

  currentClientId: number;
  currentConnectionId: number;
  currentLocationId: number;

  constructor(private http: HttpClient) {}

  getClients(): Observable<IDropdown[]> {
    return this.http.get<IDropdown[]>(`${environment.apiUrl}/api/clients`);
  }

  create(client: IClient, route: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/${route}`, client);
  }

  getConnectionsCWW(id: number): Observable<IConnectionCWW[]> {
    return this.http.get<IConnectionCWW[]>(`${environment.apiUrl}/api/connections/${id}`);
  }

  getLocations(id: number): Observable<ILocation[]> {
    return this.http.get<ILocation[]>(`${environment.apiUrl}/api/locations/${JSON.stringify({cwwc_id: id})}`);
  }

  getDepartments(id: number): Observable<IDepartment[]> {
    return this.http.get<IDepartment[]>(`${environment.apiUrl}/api/departments/${id}`);
  }

}
