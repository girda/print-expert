import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ClientService} from '../../services/client.service';


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
        name: new FormControl(null, [Validators.required]),
        login: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [Validators.required])
      });
    } else {
      this.form = new FormGroup({
        name: new FormControl(null, [Validators.required])
      });
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
