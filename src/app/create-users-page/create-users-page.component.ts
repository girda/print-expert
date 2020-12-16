import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {PopupCreateUserComponent} from '../shared/components/popup-create-user/popup-create-user.component';

@Component({
  selector: 'app-create-users-page',
  templateUrl: './create-users-page.component.html',
  styleUrls: ['./create-users-page.component.sass']
})
export class CreateUsersPageComponent implements OnInit, OnDestroy {

  users;
  usersSubscription: Subscription;
  dialogSubscription: Subscription;
  dialogEditSubscription: Subscription;

  constructor(private userService: UserService,
              public matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  openEditPopup(user): void {
    console.log(user);
    console.log(user.role);
    const dialogRef = this.matDialog.open(PopupCreateUserComponent, {data: user});

    this.dialogEditSubscription = dialogRef.afterClosed().subscribe(
      () => {
        this.getUsers();
      }
    );
  }

  openPopup(): void {
    const dialogRef = this.matDialog.open(PopupCreateUserComponent, {data: null});

    this.dialogSubscription = dialogRef.afterClosed().subscribe(
      () => {
        this.getUsers();
      }
    );
  }

  private getUsers(): void {
    this.usersSubscription = this.userService.getAll()
      .subscribe(
        users => {
          console.log(users);
          this.users = users;
        }
      );
  }

  ngOnDestroy(): void {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }

}
