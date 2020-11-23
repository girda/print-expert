import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {PopupComponent} from '../shared/components/popup/popup.component';
import {ClientService} from '../shared/services/client.service';

@Component({
  selector: 'app-clients-page',
  templateUrl: './clients-page.component.html',
  styleUrls: ['./clients-page.component.sass']
})

export class ClientsPageComponent implements OnInit, OnDestroy, AfterViewInit {

  clientsSubscription: Subscription;
  currentClientName: string;
  paramsClient = {name: 'Кліент', title: 'Створити нового кліента', route: 'clients', values: null};
  @ViewChild('searchClient', { read: ElementRef })  searchClientRef: ElementRef;
  searchClient$: Observable<string>;

  connectionsCWWSubscription: Subscription;
  currentConnectionIP: string;
  paramsConnection = {name: 'IP', title: 'Створити нове підключення', login: 'Логін', password: 'Пароль', route: 'connections', values: null};

  locationsSubscription: Subscription;
  currentLocationName: string;
  paramsLocation = {name: 'Місто', title: 'Створити нове місто', route: 'locations', values: null};

  departmentsSubscription: Subscription;
  paramsDepartment = {name: 'Відділ', title: 'Створити новий відділ', route: 'departments', values: null};

  dialogSubscription: Subscription;

  constructor(public clientService: ClientService,
              public matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getClients();
  }

  ngAfterViewInit(): void {
    this.searchClient$ = fromEvent(this.searchClientRef.nativeElement, 'input');
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
    this.getDepartments({location_id: this.clientService.currentLocationId});
  }

  delete(event: Event, candidate: any, route: string): void {
    event.stopPropagation();
    const decision  = window.confirm(`Ви впевнені, що хочете видалити "${candidate.name ? candidate.name : candidate.ip}"?`);

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
          this.paramsConnection.values = this.clientService.connectionsCWW;
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
          this.clientService.locations = connections;
          this.paramsLocation.values = this.clientService.locations;
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
          this.paramsDepartment.values = this.clientService.departments;
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
