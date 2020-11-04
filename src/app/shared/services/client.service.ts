
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IClient, IDropdown} from '../interfaces';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ClientService {

  constructor(private http: HttpClient) {}

  getClients(): Observable<IDropdown[]> {
    return this.http.get<IDropdown[]>(`${environment.apiUrl}/api/clients`);
  }

  create(client: IClient): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/clients`, client);
  }

}
