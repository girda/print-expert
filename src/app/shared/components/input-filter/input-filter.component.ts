import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {T} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-input-filter',
  templateUrl: './input-filter.component.html',
  styleUrls: ['./input-filter.component.sass']
})
export class InputFilterComponent implements  OnDestroy, AfterViewInit {

  @ViewChild('input', {read: ElementRef}) inputRef: ElementRef;
  input$: Observable<string>;
  inputSub: Subscription;
  inputValue: string;
  filteredList: any[];

  waitingTime = 500;

  @Input() placeholder: string;
  @Input() listForFilter: any[];
  @Input() listName: string;
  @Output() filter = new EventEmitter();

  constructor() { }

  ngAfterViewInit(): void {

    this.input$ = fromEvent(this.inputRef.nativeElement, 'input').pipe(
      map((event: any) => event.target.value),
      debounceTime(this.waitingTime)
    );

    this.inputSub = this.input$.subscribe(values => {
      this.inputValue = values;
    });
  }

  onInput(): void {
    setTimeout(() => {
      if (this.listName !== 'connections') {
        this.filteredList = this.listForFilter.filter(item => {
          const regexp = new RegExp(this.inputValue.toUpperCase());
          return item.name.toUpperCase().match(regexp);
        });
      } else {
        this.filteredList = this.listForFilter.filter(item => {
          const regexp = new RegExp(this.inputValue.toUpperCase());
          return (item.ip.toUpperCase().match(regexp) ||
            item.login.toUpperCase().match(regexp) ||
            item.pswd.toUpperCase().match(regexp));
        });
      }
      const result = {
        name: this.listName,
        list: this.filteredList
      };
      this.filter.emit(result);
    }, this.waitingTime + 100);
  }

  ngOnDestroy(): void {
    if (this.inputSub) {
      this.inputSub.unsubscribe();
    }
  }
}
