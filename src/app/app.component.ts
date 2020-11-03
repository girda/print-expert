import { Component, OnInit} from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    const protectionToken = localStorage.getItem('auth-token');

    if (protectionToken !== null) {
      this.auth.setToken(protectionToken);
    }
  }
}
