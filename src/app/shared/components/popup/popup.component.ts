import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {ClientService} from '../../services/client.service';
import {log} from 'util';


@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.sass']
})
export class PopupComponent implements OnInit {

  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<PopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private clientService: ClientService) {
  }

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.login) {
      this.form = new FormGroup({
        name: new FormControl(null, [Validators.required, this.uniqueValidator.bind(this)]),
        login: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [Validators.required])
      });
    } else {
      this.form = new FormGroup({
        name: new FormControl(null, [Validators.required, this.uniqueValidator.bind(this)])
      });
    }

  }

  private uniqueValidator(control: FormControl): ValidationErrors {
    const name = control.value;
    let isNameUnique;
    if (this.data.login) {
      isNameUnique = this.data.values.map(obj => obj.ip).some(value => value === name);
    } else {
      isNameUnique = this.data.values.map(obj => obj.name).some(value => value === name);
    }

    if (!isNameUnique) {
      return null;
    } else {
      return {unavailable: true};
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log(this.form.value);
    const dataForCreate = this.form.value;
    dataForCreate.client_id = this.clientService.currentClientId;
    dataForCreate.connection_id = this.clientService.currentConnectionId;
    dataForCreate.location_id = this.clientService.currentLocationId;

    this.clientService.create(this.form.value, this.data.route)
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
