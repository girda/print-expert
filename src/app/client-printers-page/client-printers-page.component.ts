import {Component} from '@angular/core';
import {Module} from 'ag-grid-community';
import {ExcelExportModule} from '@ag-grid-enterprise/excel-export';
import {RichSelectModule} from '@ag-grid-enterprise/rich-select';
import {AgGridService} from '../shared/services/ag-grid.service';

@Component({
  selector: 'app-client-printers-page',
  templateUrl: './client-printers-page.component.html',
  styleUrls: ['./client-printers-page.component.sass']
})
export class ClientPrintersPageComponent {

// @ts-ignore
  modules: Module[] = [ExcelExportModule, RichSelectModule];

  constructor(public gridService: AgGridService) {
    this.gridService.gridOptions.context = {componentParent: this};
  }

  onBtnExportCSV(): void {
    this.gridService.gridOptions.api.exportDataAsCsv();
  }

  onBtnExportExcel(): void {
    this.gridService.gridOptions.api.exportDataAsExcel();
  }

}
