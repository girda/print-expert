
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IDropdown, ILocation, IRewritingPrinters} from '../interfaces';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PrinterService {

  locations: ILocation[] = [];

  constructor(private http: HttpClient) {}

  getClients(): Observable<IDropdown[]> {
    return this.http.get<IDropdown[]>(`${environment.apiUrl}/api/clients`);
  }

  getLocations(id: number): Observable<IDropdown[]> {
    return this.http.get<IDropdown[]>(`${environment.apiUrl}/api/locations/${JSON.stringify({client_id: id})}`);
  }

  getDepartments(where: any): Observable<IDropdown[]> {
    return this.http.get<IDropdown[]>(`${environment.apiUrl}/api/departments/${JSON.stringify(where)}`);
  }

  getPrinters(id: number): Observable<IDropdown[]> {
    return this.http.get<IDropdown[]>(`${environment.apiUrl}/api/printers/${id}`);
  }

  updatePrinters(printers: IRewritingPrinters[]): Observable<any> {
    return this.http.patch<any[]>(`${environment.apiUrl}/api/printers`, printers);
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
        field: 'location',
        headerTooltip: 'Город',
        filter: true,
        editable: true,
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: (params) => {
          console.log(params);
          const currentLocation: string[] = [];
          this.locations.forEach(location => {
            if (params.data.cwwc_id === location.cwwc_id) {
              currentLocation.push(location.name);
            }
          });
          return {
            values: currentLocation,
            cellHeight: 50
          };
        }
        // cellEditorParams: {
        //   cellHeight: 50,
        //   values: this.extractValues(this.locations)
        // },
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
