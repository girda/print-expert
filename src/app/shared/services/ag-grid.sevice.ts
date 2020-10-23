import {Injectable} from '@angular/core';
import {GridOptions, IDatasource} from 'ag-grid-community';
import {RestService} from './rest.service';

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
        width: 120,
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

  init(url: string): void {
    this.gridOptions.onGridReady = () => {
      console.log(url);
      this.gridOptions.api.setRowData([
        {
          client: 'Client 1',
          city: 'City 1',
          department: 'Department',
          model: 'Model',
          serial_number: 'Serial number',
          ip: 'IP',
          page_count: 'Page count',
          quantity_black: '30%',
          quantity_cn: '30%',
          quantity_mg: '30%',
          quantity_yi: '30%',
          average_coverage_bl: '30%',
          average_coverage_cn: '30%',
          average_coverage_mg: '30%',
          average_coverage_yi: '30%',
          average_coverage_all: '30%'
        }
      ]);
      // this.gridOptions.api.sizeColumnsToFit();
      // this.rest.get(url).subscribe(
      //   rowData => {
      //     console.log(rowData);
      //     this.gridOptions.api.setRowData([
      //       { make: 'Toyota', model: 'Celica', price: 35000 },
      //       { make: 'Ford', model: 'Mondeo', price: 32000 },
      //       { make: 'Porsche', model: 'Boxter', price: 72000 }
      //     ]);
      //     this.gridOptions.api.sizeColumnsToFit();
      //   },
      //   error => console.log(error)
      // );
    };
  }


}
