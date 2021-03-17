import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {KeysService} from '../../services/keys.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.sass']
})
export class SiteLayoutComponent implements OnInit {

  links: any[] = [
    {name: 'Принтери', url: 'printers'},
    {name: 'Клієнти', url: 'clients'},
    {name: 'Користувачі', url: 'create-users'},
    {name: 'Налаштування', url: 'settings'}
  ];

  isAdmin = false;

  constructor(private auth: AuthService,
              private router: Router,
              private keys: KeysService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    if (this.userService.getRole() === this.keys.roles.admin.id) {
      this.isAdmin = true;
    }
  }

  logout(event: Event): void {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
