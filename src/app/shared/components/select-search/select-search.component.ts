import { Component, Input, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.sass']
})
export class SelectSearchComponent implements OnInit {

  @Input() options: any[];
  @Input() placeholder: string;
  @Input() formGroup: FormGroup;
  @Input() controlName: string;

  search: FormControl = new FormControl();

  constructor() { }

  ngOnInit(): void {
  }

  filterMyOptions(event): void {
    console.log(event);
    // console.log(this.formFilters.get('searchClient').value);
  }
}
