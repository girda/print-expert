import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';

@Component({
  selector: 'app-input-filter',
  templateUrl: './input-filter.component.html',
  styleUrls: ['./input-filter.component.sass']
})
export class InputFilterComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('input', {read: ElementRef}) inputRef: ElementRef;
  input$: Observable<string>;
  inputSub: Subscription;
  values: string;
  waitingTime = 500;
  @Input() placeholder: string;
  @Output() inputEvent = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

    this.input$ = fromEvent(this.inputRef.nativeElement, 'input').pipe(
      map((event: any) => event.target.value),
      debounceTime(this.waitingTime)
    );

    this.inputSub = this.input$.subscribe(values => {
      this.values = values;
    });
  }

  onInput(event): void {
    setTimeout(() => {
      this.inputEvent.emit(this.values);
    }, this.waitingTime + 100);
  }

  ngOnDestroy(): void {
    if (this.inputSub) {
      this.inputSub.unsubscribe();
    }
  }
}
