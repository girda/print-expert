import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IDropdown} from '../../interfaces';
import {Subscription} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {AgGridService} from '../../services/ag-grid.service';
import {PrinterService} from '../../services/printer.service';
import {RestService} from '../../services/rest.service';
import {ClientService} from '../../services/client.service';
import {UserService} from '../../services/user.service';
import {KeysService} from '../../services/keys.service';

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
  clientsIsReady = false;
  filtersSub: Subscription;

  locations: IDropdown[];
  locationsSubscription: Subscription;
  locationsWithIdSubscription: Subscription;
  locationsIsReady = false;

  departments: IDropdown[];
  departmentsSubscription: Subscription;
  departmentsIsReady = false;

  filtersSubscription: Subscription;

  isClient = false;

  constructor(public gridService: AgGridService,
              private printerService: PrinterService,
              private rest: RestService,
              private clientService: ClientService,
              private userService: UserService,
              private keys: KeysService) {}

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

    if (this.userService.getRole() === this.keys.roles.client.id) {
      this.isClient = true;
      this.getLocationsForFilter(this.userService.getClient());
      this.formFilters.get('client').clearValidators();
      this.formFilters.get('client').updateValueAndValidity();
    } else {

      this.clientsSubscription = this.printerService.getClients()
        .subscribe(clients => {
          this.clients = clients;
          this.clientsIsReady = true;
        });
    }


    if (this.userService.filters) {
      this.updateFilters();
    } else {
      this.filtersSubscription = this.userService.getFilters()
        .subscribe(
          filters => {
            this.userService.filters = JSON.parse(filters);
            if (this.userService.filters) {
              this.updateFilters();
            }
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

    this.formFilters.patchValue({
      location: null,
      department: null
    });
    this.departmentsIsReady = false;
  }

  onChangeLocations(event): void {
    const currentClientId = this.currentClientId;

    const where = {
      name: event.value,
      client_id: currentClientId
    };

    this.departmentsSubscription = this.printerService.getDepartments(where)
      .subscribe(departments => {
        this.formFilters.patchValue({
          department: null
        });
        this.departments = departments;
        this.departmentsIsReady = true;
      });
  }

  getTable(): void {
    this.printerService.paramsForGetTable = this.formFilters.value;
    const params = this.formFilters.value;

    if (this.userService.getRole() === this.keys.roles.client.id) {
      params.client = this.userService.getClient();
    }

    if (!this.gridService.isReadyTable) {
      this.gridService.isReadyTable = true;
      this.gridService.init(`${environment.apiUrl}/api/table`, params);
    } else {
      this.rest.post(`${environment.apiUrl}/api/table`, params)
        .subscribe(rowData => {
          this.gridService.gridOptions.api.setRowData(rowData);
        });
    }

    this.filtersSub = this.userService.setFilters(this.formFilters.value, this.userService.id)
      .subscribe(res => {
        console.log(res);
        console.log(this.filtersSub);
      });
  }

  updateFilters(): void {
    this.currentClientId = this.userService.filters.client;

    this.getLocationsForFilter(this.currentClientId);
    this.getLocationsAndDepartmentsForTable(this.currentClientId);

    this.printerService.initAgGrid(this.userService.filters);

    this.formFilters.patchValue({
      client: this.userService.filters.client,
      location: this.userService.filters.location,
      department: this.userService.filters.department,
      range: {
        start: this.userService.filters.range.start,
        end: this.userService.filters.range.end
      }
    });

    if (this.userService.filters.location) {
      this.departmentsIsReady = true;
    }

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
          this.locationsIsReady = true;
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
    if (this.filtersSub) {
      this.filtersSub.unsubscribe();
    }
  }

}
