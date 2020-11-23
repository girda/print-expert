import {Injectable} from '@angular/core';
import {GridOptions, IDatasource} from 'ag-grid-community';
import {RestService} from './rest.service';
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';

@Injectable({
  providedIn: 'root'
})

export class AgGridService {

  gridOptions: GridOptions;
  localeText = {
    filterOoo: 'Фильтр...',
    applyFilter: 'Применить'
  };

  isReadyTable = false;

  constructor(private rest: RestService) {
    this.gridOptions = {
      defaultColDef: {
        width: 100,
        sortable: true,
        lockPosition: true
      },
      rowSelection: 'single',
      tooltipShowDelay: 500,
      localeText: this.localeText
    };
  }

  init(url: string, params): void {
    console.log(params);
    this.gridOptions.onGridReady = () => {
      this.gridOptions.api.sizeColumnsToFit();
      this.rest.post(url, params).subscribe(
        rowData => {
          console.log(rowData);
          this.gridOptions.api.setRowData(rowData);
        },
        error => {
          console.log(error);
        }
      );
    };
  }


}
