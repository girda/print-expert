import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {KeysService} from '../../services/keys.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../../services/user.service';
import {ClientService} from '../../services/client.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-popup-create-user',
  templateUrl: './popup-create-user.component.html',
  styleUrls: ['./popup-create-user.component.sass']
})
export class PopupCreateUserComponent implements OnInit, OnDestroy {

  form: FormGroup;
  roles;
  clients;
  clientsSubscription: Subscription;

  flagHiddenClient = true;

  constructor(private keys: KeysService,
              public dialogRef: MatDialogRef<PopupCreateUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private userService: UserService,
              private clientsService: ClientService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      email: new FormControl(null, [Validators.email]),
      name: new FormControl(null),
      role: new FormControl(null, [Validators.required]),
      client: new FormControl(null)
    });

    this.roles = [this.keys.roles.admin, this.keys.roles.user, this.keys.roles.client];
    this.clientsSubscription = this.clientsService.getClients()
      .subscribe(
        clients => {
          this.clients = clients;
        },
        error => {
          console.log(error);
        }
      );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onChangeRole(event): void {
    if (event.value === this.keys.roles.client.id) {
      this.flagHiddenClient = false;
      this.form.get('client').setValidators([Validators.required]);
    } else {
      this.flagHiddenClient = true;
      this.form.get('client').clearValidators();
    }
    this.form.get('client').updateValueAndValidity();
  }

  onSubmit(): void {
    this.userService.create(this.form.value)
      .subscribe(
        res => {
          this.dialogRef.close();
          alert(res.message);
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnDestroy(): void {
    if (this.clientsSubscription) {
      this.clientsSubscription.unsubscribe();
    }
  }

}
