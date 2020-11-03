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
        // floatingFilterComponentParams: {suppressFilterButton: true},
        // filter: true,
        // floatingFilter: true,
        // filterParams: {
        //   // debounceMs: 1500,
        //   buttons: ['apply'],
        // }
      },
      rowSelection: 'single',
      tooltipShowDelay: 500,
      // rowModelType: 'infinite',
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
          console.log(error)
          this.gridOptions.api.setRowData([
            {
              client: 'Intertop',
              city: 'Киев',
              department: 'Department',
              model: 'HP-12-PH3478',
              serial_number: '12312341254',
              ip: '192.168.0.1',
              page_count: '12345',
              quantity_black: '30%',
              quantity_cn: '30%',
              quantity_mg: '30%',
              quantity_yl: '30%',
              average_coverage_bl: '30%',
              average_coverage_cn: '30%',
              average_coverage_mg: '30%',
              average_coverage_yl: '30%',
              average_coverage_all: '30%',
              cartridge_resource_bl: '',
              cartridge_resource_cn: '',
              cartridge_resource_mg: '',
              cartridge_resource_yl: ''
            },
            {
              client: 'Intertop',
              city: 'Киев',
              department: 'Department',
              model: 'HP-34-PG3479',
              serial_number: '12312341254',
              ip: '192.168.0.2',
              page_count: '12225',
              quantity_black: '30%',
              quantity_cn: '30%',
              quantity_mg: '30%',
              quantity_yi: '30%',
              average_coverage_bl: '30%',
              average_coverage_cn: '30%',
              average_coverage_mg: '30%',
              average_coverage_yi: '30%',
              average_coverage_all: '30%',
              cartridge_resource_bl: '',
              cartridge_resource_cn: '',
              cartridge_resource_mg: '',
              cartridge_resource_yi: ''
            }
          ]);
          this.gridOptions.api.sizeColumnsToFit();
        }
      );
    };
  }


}
