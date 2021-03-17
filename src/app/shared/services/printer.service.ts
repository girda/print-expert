import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IDropdown, ILocation, IRewritingPrinters} from '../interfaces';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AgGridService} from './ag-grid.service';
import {UserService} from './user.service';
import {KeysService} from './keys.service';

@Injectable({
  providedIn: 'root'
})

export class PrinterService {

  locations: ILocation[] = [];
  departments = [];
  mapDepartments;
  paramsForGetTable;

  constructor(private http: HttpClient,
              public gridService: AgGridService,
              private userService: UserService,
              private keys: KeysService) {
  }

  getClients(): Observable<IDropdown[]> {
    return this.http.get<IDropdown[]>(`${environment.apiUrl}/api/clients`);
  }

  getLocations(id: number): Observable<IDropdown[]> {
    return this.http.get<IDropdown[]>(`${environment.apiUrl}/api/locations/${JSON.stringify({client_id: id, distinct: true})}`);
  }

  getDepartments(where: any): Observable<IDropdown[]> {
    return this.http.get<IDropdown[]>(`${environment.apiUrl}/api/departments/${JSON.stringify(where)}`);
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
    const columnDefs = [
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
            editable: true,
            cellStyle: { backgroundColor: '#f3f3c3', borderRight: '1px solid #dde2eb', borderLeft: '1px solid #dde2eb'},
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: (params) => {
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
            cellStyle: { backgroundColor: '#f3f3c3', borderRight: '1px solid #dde2eb'},
            editable: (params) => {
              return params.data.location;
            },
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: (params) => {
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
            headerName: 'Статус',
            field: 'absent_text',
            headerTooltip: 'Статус',
            cellClass: 'grid-cell-icon',
            tooltipValueGetter: params => {
              if (params.value) {
                return 'За принтером не зібрані дані за датами: ' + params.value;
              } else {
                return 'Дані зібрано за всі дати періоду.';
              }

            },
            cellRenderer: params => {
              console.log(params);
              let icon: string;
              if (params.value) {
                icon = '<svg height="32" ' +
                  'style="overflow: visible; enable-background: new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:#D72828;"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg>';
              } else {
                icon = '<svg height="32" style="overflow: visible; enable-background: new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" ><g><g id="Complete_x5F_Symbol_1_"><g id="Complete_x5F_Symbol"><circle cx="16" cy="16" id="BG" r="16" style="fill:#19D873;"/><polygon id="Done_x5F_Symbol" points="14,17.9 14,17.9 14,17.9 10.1,14 8,16.1         14,22.1 24,12.1 21.9,10 " style="fill:#E6E6E6;"/></g></g></g></svg>';
              }
              return icon;
            },
            width: 70
          }
        ]
      },
      {
        headerName: 'Сторінок',
        headerTooltip: 'Кількість роздрукованих сторінок',
        headerClass: 'grid-cell-centered grid-cell-border',
        children: [
          {
            headerName: 'Всього',
            headerClass: 'grid-cell-centered',
            cellStyle: {textAlign: 'center'},
            field: 'page_count_all',
            columnGroupShow: 'closed',
            width: 100
          },
          {
            headerName: 'Чорні',
            headerClass: 'grid-cell-centered',
            cellStyle: {textAlign: 'center'},
            field: 'page_count_bk',
            columnGroupShow: 'open'
          },
          {
            headerName: 'Кольорові',
            headerClass: 'grid-cell-centered',
            cellStyle: {textAlign: 'center'},
            field: 'page_count_col',
            columnGroupShow: 'open'
          }
        ]
      },
      {
        headerName: 'Кількість замін картриджів',
        headerClass: 'grid-cell-centered grid-cell-border',
        headerTooltip: 'Кількість замін картриджів',
        children: [
          {
            headerName: 'Всього',
            headerClass: 'grid-cell-centered',
            cellStyle: {textAlign: 'center'},
            field: 'quantity_all',
            columnGroupShow: 'closed',
            width: 100
          },
          {
            headerName: 'Black',
            headerClass: 'grid-cell-centered pseudo-black',
            field: 'quantity_black',
            width: 70,
            cellStyle: {textAlign: 'center'},
            columnGroupShow: 'open'
          },
          {
            headerName: 'CN',
            headerClass: 'grid-cell-centered pseudo-cyan',
            field: 'quantity_cn',
            width: 70,
            cellStyle: {textAlign: 'center'},
            columnGroupShow: 'open'
          },
          {
            headerName: 'MG',
            headerClass: 'grid-cell-centered pseudo-magenta',
            field: 'quantity_mg',
            width: 70,
            cellStyle: {textAlign: 'center'},
            columnGroupShow: 'open'
          },
          {
            headerName: 'YL',
            headerClass: 'grid-cell-centered pseudo-yellow',
            field: 'quantity_yl',
            width: 70,
            cellStyle: {textAlign: 'center'},
            columnGroupShow: 'open'
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
            cellStyle: {textAlign: 'center', backgroundColor: '#f3f3c3', borderRight: '1px solid #dde2eb', borderLeft: '1px solid #dde2eb'}
          },
          {
            headerName: 'CN',
            headerClass: 'grid-cell-centered pseudo-cyan',
            field: 'cartridge_resource_cn',
            width: 70,
            editable: true,
            cellStyle: {textAlign: 'center', backgroundColor: '#f3f3c3', borderRight: '1px solid #dde2eb'}
          },
          {
            headerName: 'MG',
            headerClass: 'grid-cell-centered pseudo-magenta',
            field: 'cartridge_resource_mg',
            width: 70,
            editable: true,
            cellStyle: {textAlign: 'center', backgroundColor: '#f3f3c3', borderRight: '1px solid #dde2eb'}
          },
          {
            headerName: 'YL',
            headerClass: 'grid-cell-centered pseudo-yellow',
            field: 'cartridge_resource_yl',
            width: 70,
            editable: true,
            cellStyle: {textAlign: 'center', backgroundColor: '#f3f3c3', borderRight: '1px solid #dde2eb'}
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
            cellStyle: {textAlign: 'center'},
          },
          {
            headerName: 'Color',
            headerClass: 'grid-cell-centered pseudo-color',
            field: 'average_coverage_all_color',
            width: 70,
            cellStyle: {textAlign: 'center'},
            columnGroupShow: 'closed'
          },
          {
            headerName: 'CN',
            headerClass: 'grid-cell-centered pseudo-cyan',
            field: 'average_coverage_cn',
            width: 70,
            cellStyle: {textAlign: 'center'},
            columnGroupShow: 'open'
          },
          {
            headerName: 'MG',
            headerClass: 'grid-cell-centered pseudo-magenta',
            field: 'average_coverage_mg',
            width: 70,
            cellStyle: {textAlign: 'center'},
            columnGroupShow: 'open'
          },
          {
            headerName: 'YL',
            headerClass: 'grid-cell-centered pseudo-yellow',
            field: 'average_coverage_yl',
            width: 70,
            cellStyle: {textAlign: 'center'},
            columnGroupShow: 'open'
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

    if (this.userService.getRole() !== this.keys.roles.admin.id) {
      columnDefs.forEach(columnGroup => {
        columnGroup.children.forEach(column => {
          if (column.editable) {
            delete column.editable;
            delete column.cellStyle;
          }
        });
      });
    }

    return columnDefs;
  }
}
