import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPrintersPageComponent } from './client-printers-page.component';

describe('ClientPrintersPageComponent', () => {
  let component: ClientPrintersPageComponent;
  let fixture: ComponentFixture<ClientPrintersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientPrintersPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPrintersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
