import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {IDropdown} from '../shared/interfaces';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.sass']
})
export class SettingsPageComponent implements OnInit {

  formTimer: FormGroup;
  hours: IDropdown[] = [];
  minutes: IDropdown[] = [];

  allHours = 24;
  allMinutes = 60;
  constructor() { }

  ngOnInit(): void {
    this.formTimer = new FormGroup({
      hour: new FormControl(null),
      minutes: new FormControl(null)
    });

    for (let i = 0; i < this.allHours; i++) {
      this.hours.push({name: `${i}`, id: i});
    }

    for (let i = 0; i < this.allMinutes; i++) {
      if (i % 5 === 0 && i !== 0) {
        this.minutes.push({name: `${i}`, id: i});
      }
    }


    console.log(this.hours);
    console.log(this.minutes);
  }

}
