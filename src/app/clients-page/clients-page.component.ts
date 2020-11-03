import { Component, OnInit } from '@angular/core';
import {IDropdown} from '../shared/interfaces';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PrinterService} from '../shared/services/printer.service';
import {MatDialog} from '@angular/material/dialog';
import { PopupComponent } from '../shared/components/popup/popup.component';

@Component({
  selector: 'app-clients-page',
  templateUrl: './clients-page.component.html',
  styleUrls: ['./clients-page.component.sass']
})
export class ClientsPageComponent implements OnInit {

  form: FormGroup;

  clients: IDropdown[];
  clientsSubscription: Subscription;
  clientsIsReady = true;

  constructor(private printerService: PrinterService,
              public matDialog: MatDialog) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      client: new FormControl(null, [Validators.required]),
    });

    this.clientsSubscription = this.printerService.getClients()
      .subscribe(clients => {
        this.clients = clients;
        this.clientsIsReady = false;
      });
  }

  openPopup(): void {
    const dialogRef = this.matDialog.open(PopupComponent, {data: 'bla' });
  }

}
