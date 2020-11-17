import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IDropdown, ILocation, IRewritingPrinters} from '../interfaces';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AgGridService} from './ag-grid.service';

@Injectable({
  providedIn: 'root'
})

export class PrinterService {

  locations: ILocation[] = [];
  departments = [];
  mapDepartments;

  constructor(private http: HttpClient,
              public gridService: AgGridService) {
  }

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

  locationToDepartmentMap(match): string[] {
    return this.mapDepartments[match];
  }

  initAgGrid(params): void {
    this.gridService.gridOptions.columnDefs = this.createColumnDefs();
    this.gridService.isReadyTable = true;
    this.gridService.init(`${environment.apiUrl}/api/table`, params);
  }

  createColumnDefs(): any[] {
    return [
      {
        headerName: 'Атрибути принтерів',
        headerClass: 'grid-cell-centered ',
        headerTooltip: 'Атрибути принтерів',
        children: [
          {
            headerName: 'Клієнт',
            field: 'client',
            headerTooltip: 'Клієнт'
          },
          {
            headerName: 'Місто',
            field: 'location',
            headerTooltip: 'Місто',
            filter: true,
            editable: true,
            cellStyle: { backgroundColor: '#f3f3c3' },
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
          },
          {
            headerName: 'Відділ',
            field: 'department',
            headerTooltip: 'Відділ',
            cellStyle: { backgroundColor: '#f3f3c3' },
            filter: true,
            editable: (params) => {
              return params.data.location;
            },
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: (params) => {
              console.log(params);
              console.log(this.departments);
              const currentDepartments: string[] = [];
              this.departments.forEach(department => {
                if (params.data.location_id === department.location_id) {
                  currentDepartments.push(department.name);
                }
              });
              return {
                values: currentDepartments,
                cellHeight: 50
              };
            }
            // floatingFilter: true,
            // floatingFilterComponentParams: {suppressFilterButton: true}
          },
          {
            headerName: 'Модель',
            field: 'model',
            headerTooltip: 'Модель'
          },
          {
            headerName: 'Серійний №',
            field: 'serial_number',
            headerTooltip: 'Серійний №'
          },
          {
            headerName: 'IP',
            field: 'ip',
            headerTooltip: 'IP',
            width: 70
          },
          {
            headerName: 'К-сть сторінок',
            field: 'page_count',
            headerTooltip: 'Кількість роздрукованих сторінок'
          }]
      },
      {
        headerName: 'Кількість замін картриджів',
        headerClass: 'grid-cell-centered grid-cell-border',
        headerTooltip: 'Кількість замін картриджів',
        children: [
          {
            headerName: 'Black',
            headerClass: 'grid-cell-centered pseudo-black',
            field: 'quantity_black',
            width: 70,
            cellStyle: {textAlign: 'center'}
          },
          {
            headerName: 'CN',
            headerClass: 'grid-cell-centered pseudo-cyan',
            field: 'quantity_cn',
            width: 70,
            cellStyle: {textAlign: 'center'}
          },
          {
            headerName: 'MG',
            headerClass: 'grid-cell-centered pseudo-magenta',
            field: 'quantity_mg',
            width: 70,
            cellStyle: {textAlign: 'center'}
          },
          {
            headerName: 'YL',
            headerClass: 'grid-cell-centered pseudo-yellow',
            field: 'quantity_yl',
            width: 70,
            cellStyle: {textAlign: 'center'}
          },
        ]
      },
      {
        headerName: 'Ресурс картриджу',
        headerClass: 'grid-cell-centered grid-cell-border',
        headerTooltip: 'Ресурс картриджу',
        children: [
          {
            headerName: 'Black',
            headerClass: 'grid-cell-centered pseudo-black',
            field: 'cartridge_resource_bk',
            width: 70,
            editable: true,
            cellStyle: {textAlign: 'center', backgroundColor: '#f3f3c3'}
          },
          {
            headerName: 'CN',
            headerClass: 'grid-cell-centered pseudo-cyan',
            field: 'cartridge_resource_cn',
            width: 70,
            editable: true,
            cellStyle: {textAlign: 'center', backgroundColor: '#f3f3c3'}
          },
          {
            headerName: 'MG',
            headerClass: 'grid-cell-centered pseudo-magenta',
            field: 'cartridge_resource_mg',
            width: 70,
            editable: true,
            cellStyle: {textAlign: 'center', backgroundColor: '#f3f3c3'}
          },
          {
            headerName: 'YL',
            headerClass: 'grid-cell-centered pseudo-yellow',
            field: 'cartridge_resource_yl',
            width: 70,
            editable: true,
            cellStyle: {textAlign: 'center', backgroundColor: '#f3f3c3'}
          }
        ]
      },
      {
        headerName: 'Середнє заповнення сторінок',
        headerClass: 'grid-cell-centered grid-cell-border',
        headerTooltip: 'Середнє заповнення сторінок',
        children: [
          {
            headerName: 'Black',
            headerClass: 'grid-cell-centered pseudo-black',
            field: 'average_coverage_bk',
            width: 70,
            cellStyle: {textAlign: 'center'}
          },
          {
            headerName: 'CN',
            headerClass: 'grid-cell-centered pseudo-cyan',
            field: 'average_coverage_cn',
            width: 70,
            cellStyle: {textAlign: 'center'}
          },
          {
            headerName: 'MG',
            headerClass: 'grid-cell-centered pseudo-magenta',
            field: 'average_coverage_mg',
            width: 70,
            cellStyle: {textAlign: 'center'}
          },
          {
            headerName: 'YL',
            headerClass: 'grid-cell-centered pseudo-yellow',
            field: 'average_coverage_yl',
            width: 70,
            cellStyle: {textAlign: 'center'}
          },
          {
            headerName: 'Всього',
            headerClass: 'grid-cell-centered',
            field: 'average_coverage_all',
            width: 120,
            cellStyle: {textAlign: 'center'}
          }
        ]
      }
    ];
  }
}
