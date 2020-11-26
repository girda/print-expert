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

  formTimerErrors: FormGroup;
  period: IDropdown[] = [];

  timerSettings: ITimer;
  timerSettingsSub: Subscription;

  timerErrorsSettings: ITimer;

  allHours = 24;
  allMinutes = 60;
  allPeriod = 12;

  constructor(private timerService: TimerService,
              private keys: KeysService) {
  }

  ngOnInit(): void {
    this.formTimer = new FormGroup({
      hour: new FormControl(null),
      minutes: new FormControl(null)
    });

    this.formTimerErrors = new FormGroup({
      hour: new FormControl(null),
      minutes: new FormControl(null),
      period: new FormControl(null)
    });


    for (let i = 0; i < this.allHours; i++) {
      this.hours.push({name: `${i}`, id: i});
    }

    for (let i = 0; i < this.allMinutes; i++) {
      if (i % 5 === 0) {
        this.minutes.push({name: `${i}`, id: i});
      }
    }

    for (let i = 0; i < this.allPeriod; i++) {
        this.period.push({name: `${i + 1}`, id: i + 1});
    }

    this.timerSettingsSub = this.timerService.getSettings().subscribe(
      settings => {
        settings.forEach(setting => {
          console.log(this.keys.timers);
          if (setting.id === this.keys.timers.primary.id) {
            this.timerSettings = setting;
            this.formTimer.patchValue({
              hour: this.timerSettings.hh,
              minutes: this.timerSettings.mm
            });
          } else if (setting.id === this.keys.timers.errors.id) {
            this.timerErrorsSettings = setting;
            console.log(this.minutes);
            this.formTimerErrors.patchValue({
              hour: this.timerErrorsSettings.hh,
              minutes: this.timerErrorsSettings.mm === 0 ? `${this.timerErrorsSettings.mm}` : this.timerErrorsSettings.mm,
              period: this.timerErrorsSettings.period
            });
            console.log(this.formTimerErrors.value);
          }
        });
      },
      error => {
        console.log(error);
      }
    );

  }

  stopTimer(id: number): void {
    this.timerService.stopTimer(id)
      .subscribe(
        setting => {
          if (setting.id === this.keys.timers.primary.id) {
            this.timerSettings = setting;
          } else if (setting.id === this.keys.timers.errors.id) {
            this.timerErrorsSettings = setting;
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  startTimer(id: number, values): void {
    console.log(values);
    this.timerService.startTimer(id, values)
      .subscribe(
        setting => {
          if (setting.id === this.keys.timers.primary.id) {
            this.timerSettings = setting;
            this.formTimer.patchValue({
              hour: this.timerSettings.hh,
              minutes: this.timerSettings.mm
            });
          } else if (setting.id === this.keys.timers.errors.id) {
            this.timerErrorsSettings = setting;
            this.formTimerErrors.patchValue({
              hour: this.timerErrorsSettings.hh,
              minutes: this.timerErrorsSettings.mm === 0 ? `${this.timerErrorsSettings.mm}` : this.timerErrorsSettings.mm,
              period: this.timerErrorsSettings.period
            });
          }

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
