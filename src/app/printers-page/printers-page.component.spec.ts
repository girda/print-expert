import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintersPageComponent } from './printers-page.component';

describe('UserPageComponent', () => {
  let component: PrintersPageComponent;
  let fixture: ComponentFixture<PrintersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintersPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
