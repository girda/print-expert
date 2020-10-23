import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.sass']
})
export class SelectSearchComponent implements OnInit {

  @Input() opionts: any[];
  @Input() placeholder: string;

  search: FormControl = new FormControl();

  constructor() { }

  ngOnInit(): void {
  }

  filterMyOptions(event) {
    console.log(event);
    // console.log(this.formFilters.get('searchClient').value);
  }
}
