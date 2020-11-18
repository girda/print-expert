import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IDropdown} from '../../shared/interfaces';
import {Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AgGridService} from '../../shared/services/ag-grid.service';
import {PrinterService} from '../../shared/services/printer.service';
import {RestService} from '../../shared/services/rest.service';
import {ClientService} from '../../shared/services/client.service';
import {UserService} from '../../shared/services/user.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.sass']
})
export class FiltersComponent implements OnInit, OnDestroy {

  formFilters: FormGroup;
  range: FormGroup;

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

  filtersSubscription: Subscription;

  constructor(public gridService: AgGridService,
              private printerService: PrinterService,
              private rest: RestService,
              private clientService: ClientService,
              private userService: UserService) {}

  ngOnInit(): void {
    this.formFilters = new FormGroup({
      client: new FormControl(null, [Validators.required]),
      location: new FormControl(null),
      department: new FormControl(null),
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

    if (this.userService.filters) {
      this.updateFilters();
    } else {
      this.filtersSubscription = this.userService.getFilters()
        .subscribe(
          filters => {
            this.userService.filters = JSON.parse(filters);
            this.updateFilters();
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  onChangeClients(event): void {
    console.log(event);
    const id = event.value;
    this.currentClientId = event.value;

    this.getLocationsForFilter(id);
    this.getLocationsAndDepartmentsForTable(id);
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

  getTable(): void {
    this.printerService.paramsForGetTable = this.formFilters.value;
    if (!this.gridService.isReadyTable) {
      this.gridService.isReadyTable = true;
      this.gridService.init(`${environment.apiUrl}/api/table`, this.formFilters.value);
    } else {
      this.rest.post(`${environment.apiUrl}/api/table`, this.formFilters.value)
        .subscribe(rowData => {
          this.gridService.gridOptions.api.setRowData(rowData);
        });
    }

    this.userService.setFilters(this.formFilters.value, this.userService.id)
      .subscribe(res => console.log(res));
  }

  updateFilters(): void {
    const currentClientId = this.userService.filters.client;
    this.getLocationsForFilter(currentClientId);
    this.getLocationsAndDepartmentsForTable(currentClientId);
    this.printerService.initAgGrid(this.userService.filters);

    this.formFilters.patchValue({
      client: this.userService.filters.client,
      range: {
        start: this.userService.filters.range.start,
        end: this.userService.filters.range.end
      }
    });

    this.printerService.paramsForGetTable = this.formFilters.value;
  }

  getLocationsAndDepartmentsForTable(id): void {
    this.locationsWithIdSubscription = this.clientService.getLocations(id)
      .subscribe(
        locations => {
          this.printerService.locations = locations;

          this.departmentsSubscription = this.printerService.getDepartments({client_id: id})
            .subscribe(departments => {
              this.departments = departments;
              this.printerService.departments = departments;
              this.printerService.mapDepartments = {};

              this.printerService.locations.forEach(location => {
                this.printerService.mapDepartments[location.name] = [];
                this.printerService.departments.forEach(department => {
                  if (department.location_id === location.id) {
                    this.printerService.mapDepartments[location.name].push(department.name);
                  }
                });
              });
            });
        },
        error => console.log(error)
      );
  }

  getLocationsForFilter(id): void {
    this.locationsSubscription = this.printerService.getLocations(id)
      .subscribe(
        locations => {
          this.locations = locations;
          this.locationsIsReady = false;
          this.gridService.gridOptions.columnDefs = this.printerService.createColumnDefs();
        },
        error => console.log(error)
      );
  }

  ngOnDestroy(): void {
    if (this.clientsSubscription) {
      this.clientsSubscription.unsubscribe();
    }
    if (this.locationsSubscription) {
      this.locationsSubscription.unsubscribe();
    }
    if (this.locationsWithIdSubscription) {
      this.locationsWithIdSubscription.unsubscribe();
    }
    if (this.departmentsSubscription) {
      this.departmentsSubscription.unsubscribe();
    }
    if (this.filtersSubscription) {
      this.filtersSubscription.unsubscribe();
    }
  }

}
