import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AgGridService} from '../shared/services/ag-grid.sevice';
import {environment} from '../../environments/environment';
import {ExcelExportModule} from '@ag-grid-enterprise/excel-export';
import {RichSelectModule} from '@ag-grid-enterprise/rich-select';

import {PrinterService} from '../shared/services/printer.service';
import {Subscription} from 'rxjs';
import {IDropdown, IRewritingPrinters} from '../shared/interfaces';
import {Module} from 'ag-grid-community';
import {RestService} from '../shared/services/rest.service';
import {ClientService} from '../shared/services/client.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './printers-page.component.html',
  styleUrls: ['./printers-page.component.sass']
})
export class PrintersPageComponent implements OnInit, OnDestroy {

  formFilters: FormGroup;
  range: FormGroup;

  // @ts-ignore
  modules: Module[] = [ExcelExportModule, RichSelectModule];

  clients: IDropdown[];
  currentClientId: number;
  clientsSubscription: Subscription;
  clientsIsReady = true;

  locations: IDropdown[];
  locationsSubscription: Subscription;
  locationsWithIdSubscription: Subscription;
  locationsIsReady = true;

  departments: IDropdown[];
  departmentsSubscription: Subscription;
  departmentsIsReady = true;

  printers: IDropdown[];
  printersSubscription: Subscription;
  printersIsReady = true;

  rewritingPrinters: IRewritingPrinters[] = [];
  rewritingPrintersSubscription: Subscription;

  constructor(public gridService: AgGridService,
              private printerService: PrinterService,
              private rest: RestService,
              private clientService: ClientService) {
    this.gridService.gridOptions.context = {componentParent: this};
  }

  ngOnInit(): void {
    this.formFilters = new FormGroup({
      client: new FormControl(null, [Validators.required]),
      location: new FormControl(null),
      department: new FormControl(null),
      printers: new FormControl(null),
      range: this.range = new FormGroup({
        start: new FormControl(null, [Validators.required]),
        end: new FormControl(null, [Validators.required])
      })
    });

    this.clientsSubscription = this.printerService.getClients()
      .subscribe(clients => {
        this.clients = clients;
        this.clientsIsReady = false;
      });
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

    console.log(this.rewritingPrinters);
  }

  onChangeClients(event): void {
    console.log(event);
    const id = event.value.id;
    this.currentClientId = event.value.id;
    this.locationsSubscription = this.printerService.getLocations(id)
      .subscribe(
        locations => {
          this.locations = locations;
          this.locationsIsReady = false;
          this.gridService.gridOptions.columnDefs = this.printerService.createColumnDefs();
        },
        error => console.log(error)
      );


    this.locationsWithIdSubscription = this.clientService.getLocations(id)
      .subscribe(
        locations => {
          console.log(locations);
          this.printerService.locations = locations;
          this.departmentsSubscription = this.printerService.getDepartments({client_id: id})
            .subscribe(departments => {
              this.departments = departments;
              this.printerService.departments = departments;
              this.departmentsIsReady = false;
              this.printerService.mapDepartments = {};
              this.printerService.locations.forEach(location => {
                this.printerService.mapDepartments[location.name] = [];
                this.printerService.departments.forEach(department => {
                  if (department.location_id === location.id) {
                    this.printerService.mapDepartments[location.name].push(department.name);
                  }
                });
              });

              console.log(this.printerService.mapDepartments);
            });
        },
        error => console.log(error)
      );
  }

  onChangeLocations(event): void {
    console.log(event);
    const where = {
      name: event.value.name,
      client_id: this.currentClientId
    };
    console.log(where);
    this.departmentsSubscription = this.printerService.getDepartments(where)
      .subscribe(departments => {
        this.departments = departments;
        this.departmentsIsReady = false;
      });
  }

  onChangeDepartments(event): void {
    console.log(event);
    const id = event.value.id;
    this.printersSubscription = this.printerService.getPrinters(id)
      .subscribe(printers => {
        this.printers = printers;
        this.printersIsReady = false;
      });
  }

  getTable(event?: Event): void {
    if (!this.gridService.isReadyTable) {
      this.gridService.isReadyTable = true;
      this.gridService.init(`${environment.apiUrl}/api/table`, this.formFilters.value);
    } else {
      this.rest.post(`${environment.apiUrl}/api/table`, this.formFilters.value)
        .subscribe(rowData => {
          this.gridService.gridOptions.api.setRowData(rowData);
        });
    }

    console.log(this.formFilters.value);
  }

  onBtnExportCSV(): void {
    this.gridService.gridOptions.api.exportDataAsCsv();
  }

  onBtnExportExcle(): void {
    this.gridService.gridOptions.api.exportDataAsExcel();
  }

  saveTable(): void {
    this.gridService.gridOptions.api.stopEditing();
    console.log(this.rewritingPrinters);
    this.rewritingPrintersSubscription = this.printerService.updatePrinters(this.rewritingPrinters)
      .subscribe(
        res => {
          alert(res.message);
          this.gridService.isReadyTable = false;
          this.getTable();
        },
        error => {
          console.log(error);
        }
      );

  }

  ngOnDestroy(): void {
    if (this.clientsSubscription) {
      this.clientsSubscription.unsubscribe();
    }
  }

}
