
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

  clients: IClient[];
  clientsSortReverse = null;

  connectionsCWW: IConnectionCWW[];
  connectionsCWWSortReverse = null;

  locations: ILocation[];
  locationsSortReverse = null;

  departments: IDepartment[];
  departmentsSortReverse = null;


  constructor(private http: HttpClient) {}

  getClients(): Observable<IDropdown[]> {
    this.clientsSortReverse = null;
    this.connectionsCWW = null;
    this.connectionsCWWSortReverse = null;
    this.locations = null;
    this.departments = null;
    this.locationsSortReverse = null;
    this.departmentsSortReverse = null;
    return this.http.get<IDropdown[]>(`${environment.apiUrl}/api/clients`);
  }

  create(client: any, route: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/${route}`, client);
  }

  delete(id: number, route: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/${route}/${id}`);
  }

  getConnectionsCWW(id: number): Observable<IConnectionCWW[]> {
    this.connectionsCWW = null;
    this.locations = null;
    this.departments = null;
    this.locationsSortReverse = null;
    this.departmentsSortReverse = null;
    return this.http.get<IConnectionCWW[]>(`${environment.apiUrl}/api/connections/${id}`);
  }

  getLocations(where: object): Observable<ILocation[]> {
    this.locations = null;
    this.departments = null;
    this.departmentsSortReverse = null;
    return this.http.get<ILocation[]>(`${environment.apiUrl}/api/locations/${JSON.stringify(where)}`);
  }

  getDepartments(where: any): Observable<IDropdown[]> {
    this.departments = null;
    return this.http.get<IDropdown[]>(`${environment.apiUrl}/api/departments/${JSON.stringify(where)}`);
  }

  sort(array, nameArray): void {
    switch (nameArray) {
      case 'clients':
        if (this.clientsSortReverse) {
          this.clientsSortReverse = false;
          array.sort((a, b) => a.name.localeCompare(b.name)).reverse();
        } else {
          this.clientsSortReverse = true;
          array.sort((a, b) => a.name.localeCompare(b.name));
        }
        break;
      case 'locations':
        if (this.locationsSortReverse) {
          this.locationsSortReverse = false;
          array.sort((a, b) => a.name.localeCompare(b.name)).reverse();
        } else {
          this.locationsSortReverse = true;
          array.sort((a, b) => a.name.localeCompare(b.name));
        }
        break;
      case 'departments':
        if (this.departmentsSortReverse) {
          this.departmentsSortReverse = false;
          array.sort((a, b) => a.name.localeCompare(b.name)).reverse();
        } else {
          this.departmentsSortReverse = true;
          array.sort((a, b) => a.name.localeCompare(b.name));
        }
        break;
      case 'connections':
        if (this.connectionsCWWSortReverse) {
          this.connectionsCWWSortReverse = false;
          array.sort((a, b) => a.status - b.status).reverse();
        } else {
          this.connectionsCWWSortReverse = true;
          array.sort((a, b) => a.status - b.status);
        }
        break;
    }
  }

}
