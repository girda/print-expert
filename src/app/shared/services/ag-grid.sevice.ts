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
          quantity_black: 'Quantity black',
          quantity_cn: 'Quantity CN',
          quantity_mg: 'Quantity MG',
          quantity_yi: 'Quantity YI',
          average_coverage_bl: 'Average coverage black',
          average_coverage_cn: 'Average coverage CN',
          average_coverage_mg: 'Average coverage MG',
          average_coverage_yi: 'Average coverage YI',
          average_coverage_all: 'Average coverage ALL'
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
