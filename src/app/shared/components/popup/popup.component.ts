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

  formClient: FormGroup;

  constructor(public dialogRef: MatDialogRef<PopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private clientService: ClientService) {
  }

  ngOnInit(): void {
    this.formClient = new FormGroup({
      name: new FormControl(null, [Validators.required])
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmitFormClient(): void {
    console.log(this.formClient.value);
    this.clientService.create(this.formClient.value)
      .subscribe(res => {
        console.log(res);
      });
  }

}
