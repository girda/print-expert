
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IDropdown} from '../interfaces';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PrinterService {

  constructor(private http: HttpClient) {}

  getClients(): Observable<IDropdown[]> {
    return this.http.get<IDropdown[]>(`${environment.apiUrl}/api/clients`);
  }

  getLocations(id: number): Observable<IDropdown[]> {
    return this.http.get<IDropdown[]>(`${environment.apiUrl}/api/locations/${JSON.stringify({client_id: id})}`);
  }

  getDepartment(id: number): Observable<IDropdown[]> {
    return this.http.get<IDropdown[]>(`${environment.apiUrl}/api/departments/${id}`);
  }

  getPrinters(id: number): Observable<IDropdown[]> {
    return this.http.get<IDropdown[]>(`${environment.apiUrl}/api/printers/${id}`);
  }

  createColumnDefs(): any[] {
    return [
      {
        headerName: 'Клиент',
        field: 'client',
        headerTooltip: 'Клиент'
      },
      {
        headerName: 'Город',
        field: 'city',
        headerTooltip: 'Город',
        filter: true,
        // floatingFilter: true,
        // floatingFilterComponentParams: {suppressFilterButton: true}
      },
      {
        headerName: 'Отдел',
        field: 'department',
        headerTooltip: 'Отдел',
        filter: true,
        // floatingFilter: true,
        // floatingFilterComponentParams: {suppressFilterButton: true}
      },
      {
        headerName: 'Модель',
        field: 'model',
        headerTooltip: 'Модель'
      },
      {
        headerName: 'Серийный номер',
        field: 'serial_number',
        headerTooltip: 'Серийный номер'
      },
      {
        headerName: 'IP',
        field: 'ip',
        headerTooltip: 'IP',
        width: 70
      },
      {
        headerName: 'Количество распечатанных страниц',
        field: 'page_count',
        headerTooltip: 'Количество распечатанных страниц'
      },
      {
        headerName: 'Количество замен картриджей',
        headerClass: 'grid-cell-centered bg-blue',
        headerTooltip: 'Количество замен картриджей',
        children: [
          {
            headerName: 'Black',
            headerClass: 'grid-cell-centered bg-black',
            field: 'quantity_black',
            width: 70,
            cellStyle: {textAlign: 'center'}
          },
          {
            headerName: 'CN',
            headerClass: 'grid-cell-centered bg-cyan',
            field: 'quantity_cn',
            width: 70,
            cellStyle: {textAlign: 'center'}
          },
          {
            headerName: 'MG',
            headerClass: 'grid-cell-centered bg-magenta',
            field: 'quantity_mg',
            width: 70,
            cellStyle: {textAlign: 'center'}
          },
          {
            headerName: 'YL',
            headerClass: 'grid-cell-centered bg-yellow',
            field: 'quantity_yl',
            width: 70,
            cellStyle: {textAlign: 'center'}
          },
        ]
      },
      {
        headerName: 'Ресурс картриджа',
        headerClass: 'grid-cell-centered bg-purple',
        headerTooltip: 'Ресурс картриджа',
        children: [
          {
            headerName: 'Black',
            headerClass: 'grid-cell-centered bg-black',
            field: 'cartridge_resource_bk',
            width: 70,
            editable: true,
            cellStyle: {textAlign: 'center'}
          },
          {
            headerName: 'CN',
            headerClass: 'grid-cell-centered bg-cyan',
            field: 'cartridge_resource_cn',
            width: 70,
            editable: true,
            cellStyle: {textAlign: 'center'}
          },
          {
            headerName: 'MG',
            headerClass: 'grid-cell-centered bg-magenta',
            field: 'cartridge_resource_mg',
            width: 70,
            editable: true,
            cellStyle: {textAlign: 'center'}
          },
          {
            headerName: 'YL',
            headerClass: 'grid-cell-centered bg-yellow',
            field: 'cartridge_resource_yl',
            width: 70,
            editable: true,
            cellStyle: {textAlign: 'center'}
          }
        ]
      },
      {
        headerName: 'Среднее заполнение страниц',
        headerClass: 'grid-cell-centered bg-green',
        headerTooltip: 'Среднее заполнение страниц',
        children: [
          {
            headerName: 'Black',
            headerClass: 'grid-cell-centered bg-black',
            field: 'average_coverage_bk',
            width: 70,
            cellStyle: {textAlign: 'center'}
          },
          {
            headerName: 'CN',
            headerClass: 'grid-cell-centered bg-cyan',
            field: 'average_coverage_cn',
            width: 70,
            cellStyle: {textAlign: 'center'}
          },
          {
            headerName: 'MG',
            headerClass: 'grid-cell-centered bg-magenta',
            field: 'average_coverage_mg',
            width: 70,
            cellStyle: {textAlign: 'center'}
          },
          {
            headerName: 'YL',
            headerClass: 'grid-cell-centered bg-yellow',
            field: 'average_coverage_yl',
            width: 70,
            cellStyle: {textAlign: 'center'}
          },
          {
            headerName: 'Всего',
            headerClass: 'grid-cell-centered',
            field: 'average_coverage_all',
            width: 70,
            cellStyle: {textAlign: 'center'}
          }
        ]
      }
    ];
  }
}
