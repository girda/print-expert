import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Input() disabled: boolean;
  @Input() selected: any;
  @Output() changeEvent = new EventEmitter();

  search: FormControl = new FormControl();

  constructor() { }

  ngOnInit(): void {
  }

  onChange(event): void {
    this.changeEvent.emit(event);
  }
}
