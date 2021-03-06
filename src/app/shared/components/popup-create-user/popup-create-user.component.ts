import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {KeysService} from '../../services/keys.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../../services/user.service';
import {ClientService} from '../../services/client.service';
import {Subscription} from 'rxjs';
import { sha256 } from 'js-sha256';

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

  isEdit = false;
  userId: number;

  constructor(private keys: KeysService,
              public dialogRef: MatDialogRef<PopupCreateUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private userService: UserService,
              private clientsService: ClientService) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      login: new FormControl(this.data ? this.data.login : null, [Validators.required]),
      password: new FormControl(this.data ? this.data.password : null, [Validators.required, Validators.minLength(6)]),
      email: new FormControl(this.data ? this.data.email : null, [Validators.email]),
      name: new FormControl(this.data ? this.data.name : null),
      role: new FormControl(this.data ? this.getRoleId(this.data.role) : null, [Validators.required]),
      client: new FormControl(null)
    });

    this.roles = [this.keys.roles.admin, this.keys.roles.user, this.keys.roles.client];
    this.clientsSubscription = this.clientsService.getClients()
      .subscribe(
        clients => {
          this.clients = clients;
          if (this.data && this.data.client) {
            this.form.patchValue({
              client: this.getClientId(this.data.client)
            });
            this.flagHiddenClient = false;
            this.form.get('client').setValidators([Validators.required]);
          }
        },
        error => {
          console.log(error);
        }
      );

    this.isEdit = this.data.isEdit;
    this.userId = this.data.id;
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      this.form.disable();
      const formData = this.form.value;
      formData.password = sha256(formData.password);
      console.log(formData);
      if (this.isEdit) {
        this.userService.update(formData, this.userId)
          .subscribe(
            res => {
              this.dialogRef.close();
              alert(res.message);
            },
            error => {
              console.log(error);
            }
          );
      } else {
        this.userService.create(formData)
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
    }
  }

  ngOnDestroy(): void {
    if (this.clientsSubscription) {
      this.clientsSubscription.unsubscribe();
    }
  }

  getRoleId(role: string): number {
    for (const key in this.keys.roles) {
      if (this.keys.roles[key].name.trim() === role.trim()) {
        return this.keys.roles[key].id;
      }
    }
  }

  getClientId(client: string): number {
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i].name.trim() === (client ? client.trim() : client)) {
        console.log(this.clients[i]);
        console.log(this.clients);
        return this.clients[i].id;
      }
    }
  }
}
