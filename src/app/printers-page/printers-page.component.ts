import {Component, OnInit} from '@angular/core';
import {AgGridService} from '../shared/services/ag-grid.service';
import {ExcelExportModule} from '@ag-grid-enterprise/excel-export';
import {RichSelectModule} from '@ag-grid-enterprise/rich-select';

import {PrinterService} from '../shared/services/printer.service';
import {Subscription} from 'rxjs';
import {IRewritingPrinters} from '../shared/interfaces';
import {Module} from 'ag-grid-community';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-user-page',
  templateUrl: './printers-page.component.html',
  styleUrls: ['./printers-page.component.sass']
})
export class PrintersPageComponent implements OnInit {
  // @ts-ignore
  modules: Module[] = [ExcelExportModule, RichSelectModule];

  rewritingPrinters: IRewritingPrinters[] = [];
  rewritingPrintersSubscription: Subscription;

  constructor(public gridService: AgGridService,
              private printerService: PrinterService,
              public http: HttpClient) {
    this.gridService.gridOptions.context = {componentParent: this};
  }

  ngOnInit(): void {
  }

  onCellValueChanged(event): void {
    let isNewPrinter = true;
    const currentPrinter = event.data;

    this.printerService.locations.forEach(location => {
      if (location.name === currentPrinter.location) {
        currentPrinter.location_id = location.id;
      }
    });

    const colId = event.column.getId();
    if (colId === 'location') {
        const selectedLocation = event.data.location;
        const selectedDepartment = event.data.department;
        const allowedDepartments = this.printerService.locationToDepartmentMap(selectedLocation);
        const departmentMismatch = allowedDepartments.indexOf(selectedDepartment) < 0;
        if (departmentMismatch) {
          event.node.setDataValue('department', null);
        }
    }

    this.rewritingPrinters.forEach(printer => {
      if (printer.printer_id === currentPrinter.printer_id) {
        printer.location_name = currentPrinter.location;
        printer.department_name = currentPrinter.department;
        printer.cwwc_id = currentPrinter.cwwc_id;
        printer.cartridge_resource_bk = currentPrinter.cartridge_resource_bk;
        printer.cartridge_resource_cn = currentPrinter.cartridge_resource_cn;
        printer.cartridge_resource_mg = currentPrinter.cartridge_resource_mg;
        printer.cartridge_resource_yl = currentPrinter.cartridge_resource_yl;
        isNewPrinter = false;
      }
    });

    if (isNewPrinter) {
      this.rewritingPrinters.push({
        printer_id: currentPrinter.printer_id,
        location_name: currentPrinter.location,
        cwwc_id: currentPrinter.cwwc_id,
        department_name: currentPrinter.department,
        cartridge_resource_bk: currentPrinter.cartridge_resource_bk,
        cartridge_resource_cn: currentPrinter.cartridge_resource_cn,
        cartridge_resource_mg: currentPrinter.cartridge_resource_mg,
        cartridge_resource_yl: currentPrinter.cartridge_resource_yl
      });
    }
  }

  onBtnExportCSV(): void {
    this.gridService.gridOptions.api.exportDataAsCsv();
  }

  onBtnExportExcel(): void {
    this.gridService.gridOptions.api.exportDataAsExcel();
  }

  saveTable(): void {
    this.gridService.gridOptions.api.stopEditing();
    this.rewritingPrintersSubscription = this.printerService.updatePrinters(this.rewritingPrinters)
      .subscribe(
        res => {
          alert(res.message);
          console.log(this.rewritingPrinters);
          this.rewritingPrinters.length = 0;
          console.log(this.rewritingPrinters);
          this.http.post<any[]>(`${environment.apiUrl}/api/table`, this.printerService.paramsForGetTable)
            .subscribe(rowData => {
              this.gridService.gridOptions.api.setRowData(rowData);
            });
        },
        error => {
          console.log(error);
        }
      );
  }

}
