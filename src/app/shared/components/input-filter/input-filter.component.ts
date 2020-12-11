import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {fromEvent, Observable} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';

@Component({
  selector: 'app-input-filter',
  templateUrl: './input-filter.component.html',
  styleUrls: ['./input-filter.component.sass']
})
export class InputFilterComponent implements OnInit {

  @ViewChild('input', {read: ElementRef}) inputRef: ElementRef;
  input$: Observable<string>;
  constructor() { }

  ngOnInit(): void {
    this.input$ = fromEvent(this.inputRef.nativeElement, 'input').pipe(
      map((event: any) => event.target.value),
      debounceTime(500)
    );
  }

  subscribe(): void {
    this.input$.subscribe(values => {

    });
  }

}
