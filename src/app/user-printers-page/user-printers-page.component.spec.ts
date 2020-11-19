import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPrintersPageComponent } from './user-printers-page.component';

describe('UserPrintersPageComponent', () => {
  let component: UserPrintersPageComponent;
  let fixture: ComponentFixture<UserPrintersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPrintersPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPrintersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
