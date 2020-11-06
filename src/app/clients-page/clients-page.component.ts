import {Component, OnDestroy, OnInit} from '@angular/core';
import {IClient, IConnectionCWW, IDepartment, ILocation} from '../shared/interfaces';
import {Observable, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {PopupComponent} from '../shared/components/popup/popup.component';
import {ClientService} from '../shared/services/client.service';

@Component({
  selector: 'app-clients-page',
  templateUrl: './clients-page.component.html',
  styleUrls: ['./clients-page.component.sass']
})

export class ClientsPageComponent implements OnInit, OnDestroy {

  clients$: Observable<IClient[]>;
  currentClientName: string;
  paramsClient = {name: 'Кліент', title: 'Створити нового кліента', route: 'clients'};

  connectionsCWWSubscription: Subscription;
  connectionsCWW: IConnectionCWW[];
  currentConnectionIP: string;
  paramsConnection = {name: 'IP', title: 'Створити нове підключення', login: 'Логін', password: 'Пароль', route: 'connections'};

  locations: ILocation[];
  locationsSubscription: Subscription;
  currentLocationName: string;
  paramsLocation = {name: 'Місто', title: 'Створити нове місто', route: 'locations'};

  departments: IDepartment[];
  departmentsSubscription: Subscription;
  paramsDepartment = {name: 'Відділ', title: 'Створити новий відділ', route: 'departments'};

  dialogSubscription: Subscription;

  constructor(private clientService: ClientService,
              public matDialog: MatDialog) {
  }


  ngOnInit(): void {
    this.clients$ = this.clientService.getClients();
  }

  openPopup(params): void {
    const dialogRef = this.matDialog.open(PopupComponent, {data: params});

    this.dialogSubscription = dialogRef.afterClosed().subscribe(
      () => {
        switch (params.route) {
          case 'clients':
            this.clients$ = this.clientService.getClients();
            this.connectionsCWW = null;
            this.locations = null;
            this.departments = null;
            break;
          case 'connections':
            this.getConnectionsCWW(this.clientService.currentClientId);
            this.locations = null;
            this.departments = null;
            break;
          case 'locations':
            this.getLocation(this.clientService.currentConnectionId);
            this.departments = null;
            break;
          case 'departments':
            this.getDepartments({location_id: this.clientService.currentLocationId});
        }
      }
    );
  }

  selectClient(event, client): void {
    console.log(client);
    this.clientService.currentClientId = client.id;
    this.currentClientName = client.name;
    this.getConnectionsCWW(client.id);
  }

  selectConnection(event, connection): void {
    console.log(connection);
    this.currentConnectionIP = connection.ip;
    this.clientService.currentConnectionId = connection.id;
    this.getLocation(connection.id);
  }

  selectLocation(event, location): void {
    console.log(location);
    this.currentLocationName = location.name;
    this.clientService.currentLocationId = location.id;
    this.getDepartments({location_id: this.clientService.currentLocationId});
  }

  private getConnectionsCWW(id: number): void {
    this.connectionsCWWSubscription = this.clientService.getConnectionsCWW(id)
      .subscribe(
        connections => {
          console.log(connections);
          this.connectionsCWW = connections;
          this.locations = null;
          this.departments = null;
        },
        error => {
          console.log(error);
        }
      );
  }

  private getLocation(id: number): void {
    this.locationsSubscription = this.clientService.getLocations(id)
      .subscribe(
        connections => {
          console.log(connections);
          this.locations = connections;
          this.departments = null;
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
          this.departments = departments;
        },
        error => {
          console.log(error);
        }
      );
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
  }


}
