import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AgGridService} from '../shared/services/ag-grid.sevice';
import {environment} from '../../environments/environment';
import {ExcelExportModule} from '@ag-grid-enterprise/excel-export';
import {RichSelectModule} from '@ag-grid-enterprise/rich-select';

import {PrinterService} from '../shared/services/printer.service';
import {Subscription} from 'rxjs';
import {IDropdown} from '../shared/interfaces';
import {Module} from 'ag-grid-community';
import {RestService} from '../shared/services/rest.service';

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
  locationsIsReady = true;

  departments: IDropdown[];
  departmentsSubscription: Subscription;
  departmentsIsReady = true;

  printers: IDropdown[];
  printersSubscription: Subscription;
  printersIsReady = true;


  constructor(public gridService: AgGridService,
              private printerService: PrinterService,
              private rest: RestService) {

    this.gridService.gridOptions.columnDefs = this.printerService.createColumnDefs();
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

  onChangeClients(event): void {
    console.log(event);
    const id = event.value.id;
    this.currentClientId = event.value.id;
    this.locationsSubscription = this.printerService.getLocations(id)
      .subscribe(locations => {
        this.locations = locations;
        this.locationsIsReady = false;
      });

    this.departmentsSubscription = this.printerService.getDepartments({client_id: id})
      .subscribe(departments => {
        this.departments = departments;
        this.departmentsIsReady = false;
      });
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

  getTable(event: Event): void {
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

  getAllRows(): void {
    this.gridService.gridOptions.api.stopEditing();
    const rowData = [];
    this.gridService.gridOptions.api.forEachNode(node => rowData.push(node.data));
    console.log(rowData);
  }

  ngOnDestroy(): void {
    if (this.clientsSubscription) {
      this.clientsSubscription.unsubscribe();
    }
  }

}
