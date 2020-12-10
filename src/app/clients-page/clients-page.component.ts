import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {PopupComponent} from '../shared/components/popup/popup.component';
import {ClientService} from '../shared/services/client.service';
import {debounceTime, map} from 'rxjs/operators';
import {IClient, IConnectionCWW, IDepartment, ILocation} from '../shared/interfaces';


@Component({
  selector: 'app-clients-page',
  templateUrl: './clients-page.component.html',
  styleUrls: ['./clients-page.component.sass']
})

export class ClientsPageComponent implements OnInit, OnDestroy, AfterViewInit {

  currentClients: IClient[];
  clientsSubscription: Subscription;
  currentClientName: string;
  paramsClient = {name: 'Кліент', title: 'Створити нового кліента', route: 'clients', values: null};
  @ViewChild('searchClient', {read: ElementRef}) searchClientRef: ElementRef;
  searchClient$: Observable<string>;
  searchClientSub: Subscription;

  currentConnectionsCWW: IConnectionCWW[];
  connectionsCWWSubscription: Subscription;
  currentConnectionIP: string;
  paramsConnection = {
    name: 'IP',
    title: 'Створити нове підключення',
    login: 'Логін',
    password: 'Пароль',
    route: 'connections',
    values: null
  };
  @ViewChild('searchConnection', {read: ElementRef}) searchConnectionRef: ElementRef;
  searchConnection$: Observable<string>;
  searchConnectionSub: Subscription;

  currentLocations: ILocation[];
  locationsSubscription: Subscription;
  currentLocationName: string;
  paramsLocation = {name: 'Місто', title: 'Створити нове місто', route: 'locations', values: null};
  @ViewChild('searchLocation', {read: ElementRef}) searchLocationRef: ElementRef;
  searchLocation$: Observable<string>;
  searchLocationSub: Subscription;

  currentDepartments: IDepartment[];
  departmentsSubscription: Subscription;
  paramsDepartment = {name: 'Відділ', title: 'Створити новий відділ', route: 'departments', values: null};
  @ViewChild('searchDepartment', {read: ElementRef}) searchDepartmentRef: ElementRef;
  searchDepartment$: Observable<string>;
  searchDepartmentSub: Subscription;


  dialogSubscription: Subscription;

  constructor(public clientService: ClientService,
              public matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getClients();
  }

  ngAfterViewInit(): void {
    this.searchClient$ = fromEvent(this.searchClientRef.nativeElement, 'input').pipe(
      map((event: any) => event.target.value),
      debounceTime(500)
    );

    this.searchClientSub = this.searchClient$.subscribe(value => {
      this.currentClients = this.clientService.clients.filter(client => {
        const regexp = new RegExp(value.toUpperCase());
        return client.name.toUpperCase().match(regexp);
      });
    });


  }

  openPopup(params): void {
    const dialogRef = this.matDialog.open(PopupComponent, {data: params});

    this.dialogSubscription = dialogRef.afterClosed().subscribe(
      () => {
        this.updateView(params.route);
      }
    );
  }

  selectClient(event, client): void {
    this.clientService.clients.forEach(c => {
      if (c.active) {
        c.active = false;
      }
    });
    client.active = true;
    this.clientService.currentClientId = client.id;
    this.currentClientName = client.name;
    this.currentConnectionsCWW = null;
    this.currentLocations = null;
    this.currentDepartments = null;
    this.getConnectionsCWW(client.id);
  }

  selectConnection(event, connection): void {
    this.clientService.connectionsCWW.forEach(c => {
      if (c.active) {
        c.active = false;
      }
    });
    connection.active = true;
    this.currentConnectionIP = connection.ip;
    this.clientService.currentConnectionId = connection.id;
    this.currentLocations = null;
    this.currentDepartments = null;
    this.getLocation(connection.id);
  }

  selectLocation(event, location): void {
    this.clientService.locations.forEach(l => {
      if (l.active) {
        l.active = false;
      }
    });
    location.active = true;
    this.currentLocationName = location.name;
    this.clientService.currentLocationId = location.id;
    this.currentDepartments = null;
    this.getDepartments({location_id: this.clientService.currentLocationId});
  }

  delete(event: Event, candidate: any, route: string): void {
    event.stopPropagation();
    const decision = window.confirm(`Ви впевнені, що хочете видалити "${candidate.name ? candidate.name : candidate.ip}"?`);

    if (decision) {
      this.clientService.delete(candidate.id, route).subscribe(
        res => {
          alert(res.message);
          this.updateView(route);
          console.log(res);
        },
        error => {
          console.log(error);
        }
      );
    }

  }

  private getClients(): void {
    this.clientsSubscription = this.clientService.getClients().subscribe(
      clients => {
        this.clientService.clients = clients;
        this.currentClients = clients;
        this.paramsClient.values = this.clientService.clients;
      }
    );
  }

  private getConnectionsCWW(id: number): void {
    this.connectionsCWWSubscription = this.clientService.getConnectionsCWW(id)
      .subscribe(
        connections => {
          console.log(connections);
          this.clientService.connectionsCWW = connections;
          this.currentConnectionsCWW = connections;
          this.paramsConnection.values = this.clientService.connectionsCWW;

          setTimeout(() => {
            this.searchConnection$ = fromEvent(this.searchConnectionRef.nativeElement, 'input').pipe(
              map((event: any) => event.target.value),
              debounceTime(500)
            );
            this.searchConnectionSub = this.searchConnection$.subscribe(value => {
              this.currentConnectionsCWW = this.clientService.connectionsCWW.filter(connection => {
                const regexp = new RegExp(value.toUpperCase());
                return connection.ip.toUpperCase().match(regexp) || connection.login.toUpperCase().match(regexp) || connection.pswd.toUpperCase().match(regexp);
              });
            });
          }, 0);
        },
        error => {
          console.log(error);
        }
      );
  }

  private getLocation(id: number): void {
    this.locationsSubscription = this.clientService.getLocations({cwwc_id: id, distinct: false})
      .subscribe(
        locations => {
          console.log(locations);
          this.clientService.locations = locations;
          this.currentLocations = locations;
          this.paramsLocation.values = this.clientService.locations;

          setTimeout(() => {
            this.searchLocation$ = fromEvent(this.searchLocationRef.nativeElement, 'input').pipe(
              map((event: any) => event.target.value),
              debounceTime(500)
            );
            this.searchLocationSub = this.searchLocation$.subscribe(value => {
              this.currentLocations = this.clientService.locations.filter(location => {
                const regexp = new RegExp(value.toUpperCase());
                return location.name.toUpperCase().match(regexp);
              });
            });
          }, 0);

        },
        error => {
          console.log(error);
        }
      );
  }

  private getDepartments(where: any): void {
    this.departmentsSubscription = this.clientService.getDepartments(where)
      .subscribe(
        departments => {
          console.log(departments);
          this.clientService.departments = departments;
          this.currentDepartments = departments;
          this.paramsDepartment.values = this.clientService.departments;

          setTimeout(() => {
            this.searchDepartment$ = fromEvent(this.searchDepartmentRef.nativeElement, 'input').pipe(
              map((event: any) => event.target.value),
              debounceTime(500)
            );
            this.searchDepartmentSub = this.searchDepartment$.subscribe(value => {
              this.currentDepartments = this.clientService.departments.filter(location => {
                const regexp = new RegExp(value.toUpperCase());
                return location.name.toUpperCase().match(regexp);
              });
            });
          }, 0);
        },
        error => {
          console.log(error);
        }
      );
  }

  private updateView(route): void {
    switch (route) {
      case 'clients':
        this.getClients();
        break;
      case 'connections':
        this.getConnectionsCWW(this.clientService.currentClientId);
        break;
      case 'locations':
        this.getLocation(this.clientService.currentConnectionId);
        break;
      case 'departments':
        this.getDepartments({location_id: this.clientService.currentLocationId});
    }
  }

  ngOnDestroy(): void {
    if (this.connectionsCWWSubscription) {
      this.connectionsCWWSubscription.unsubscribe();
    }
    if (this.locationsSubscription) {
      this.locationsSubscription.unsubscribe();
    }
    if (this.departmentsSubscription) {
      this.departmentsSubscription.unsubscribe();
    }
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
    if (this.clientsSubscription) {
      this.clientsSubscription.unsubscribe();
    }
  }


}
