import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUsersPageComponent } from './create-users-page.component';

describe('CreateUsersPageComponent', () => {
  let component: CreateUsersPageComponent;
  let fixture: ComponentFixture<CreateUsersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUsersPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
