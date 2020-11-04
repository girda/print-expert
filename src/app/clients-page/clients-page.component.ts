import { Component, OnInit } from '@angular/core';
import {IDropdown} from '../shared/interfaces';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PrinterService} from '../shared/services/printer.service';
import {MatDialog} from '@angular/material/dialog';
import { PopupComponent } from '../shared/components/popup/popup.component';
import {ClientService} from '../shared/services/client.service';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'}
];
@Component({
  selector: 'app-clients-page',
  templateUrl: './clients-page.component.html',
  styleUrls: ['./clients-page.component.sass']
})

export class ClientsPageComponent implements OnInit {

  links: any[] = [
    {name: 'Принтери', url: 'printers'},
    {name: 'Кліенти', url: 'clients'}
  ];

  constructor(private clientService: ClientService,
              public matDialog: MatDialog) { }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  ngOnInit(): void {

  }

  openPopup(): void {
    const dialogRef = this.matDialog.open(PopupComponent, {data: 'bla' });
  }
  selectClient(event, link): void {
    console.log(link);
  }


}
