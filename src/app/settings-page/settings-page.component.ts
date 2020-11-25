import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {IDropdown, ITimer} from '../shared/interfaces';
import {TimerService} from '../shared/services/timer.service';
import {KeysService} from '../shared/services/keys.service';
import {Observable, Subscription} from 'rxjs';
import {message} from 'ag-grid-community/dist/lib/utils/general';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.sass']
})
export class SettingsPageComponent implements OnInit, OnDestroy {

  formTimer: FormGroup;
  hours: IDropdown[] = [];
  minutes: IDropdown[] = [];

  timerSettings: ITimer;
  timerSettingsSub: Subscription;

  allHours = 24;
  allMinutes = 60;

  constructor(private timerService: TimerService,
              private keys: KeysService) {
  }

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

    this.timerService.getSettings().subscribe(
      settings => {
        settings.forEach(setting => {
          console.log(this.keys.timers);
          if (setting.id === this.keys.timers.primary.id) {
            this.timerSettings = setting;
          }
        });
        console.log(this.timerSettings);
      },
      error => {
        console.log(error);
      }
    );

  }

  stopTimer(): void {

  }

  startTimer(): void {
    this.timerService.startTimer(this.timerSettings.id)
      .subscribe(
        setting => {
          this.timerSettings = setting;
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnDestroy(): void {
    if (this.timerSettingsSub) {
      this.timerSettingsSub.unsubscribe();
    }
  }

}
