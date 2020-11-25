import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ITimer} from '../interfaces';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TimerService {

  constructor(private http: HttpClient) {}

  getSettings(): Observable<ITimer[]> {
    return this.http.get<ITimer[]>(`${environment.apiUrl}/api/timer`);
  }

  startTimer(id: number): Observable<any> {
    return this.http.get<ITimer[]>(`${environment.apiUrl}/api/timer/start/${id}`);
  }

}
