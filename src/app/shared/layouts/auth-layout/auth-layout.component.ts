import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.sass']
})
export class AuthLayoutComponent implements OnInit {

  form: FormGroup;
  constructor() { }

  ngOnInit(): void {

  }

}
