import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-user-page',
  templateUrl: './printers-page.component.html',
  styleUrls: ['./printers-page.component.sass']
})
export class PrintersPageComponent implements OnInit {

  formFilters: FormGroup;
  searchClient: FormControl = new FormControl();
  clients: any[] = [{name: 'One', id: 1}, {name: 'Two', id: 2}, {name: 'Three', id: 3}];

  constructor() { }

  ngOnInit(): void {
    this.formFilters = new FormGroup({
      client: new FormControl(null)
    });
  }

  bla() {
    console.log(this.formFilters.get('client').value);
  }
  filterMyOptions(event) {
    console.log(event);
    // console.log(this.formFilters.get('searchClient').value);
  }

}
