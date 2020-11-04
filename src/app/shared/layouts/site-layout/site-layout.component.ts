import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.sass']
})
export class SiteLayoutComponent {

  links: any[] = [
    {name: 'Принтери', url: 'printers'},
    {name: 'Кліенти', url: 'clients'}
  ];

  constructor(private auth: AuthService,
              private router: Router) { }

  logout(event: Event): void {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  showInfo(link) {
    console.log(link);
  }

}
