import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import {UserService} from '../shared/services/user.service';
import {KeysService} from '../shared/services/keys.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.sass']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  aSub: Subscription;

  constructor(private route: ActivatedRoute,
              private auth: AuthService,
              private router: Router,
              private userService: UserService,
              private keys: KeysService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params.accessDenied) {
        alert('Для початку потрібно зареєструватися в системі');
      } else if (params.incorrectRole) {
        alert('У вас недостатньо прав, зверніться до адміністратора');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  onSubmit(): void {
    this.form.disable();

    this.aSub = this.auth.login(this.form.value).subscribe(
      () => {
        if (this.userService.getRole() === this.keys.roles.admin.id) {
          this.router.navigate(['/printers']);
        } else if (this.userService.getRole() === this.keys.roles.client.id) {
          this.router.navigate(['/client-printers']);
        } else if (this.userService.getRole() === this.keys.roles.user.id) {
          this.router.navigate(['/user-printers']);
        }
        this.form.enable();
      },
      error => {
        alert(error.error.message);
        this.form.enable();
      }
    );
  }

}
