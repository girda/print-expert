import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {GuardServices} from './shared/services/guard.service';

import {AuthLayoutComponent} from './shared/layouts/auth-layout/auth-layout.component';
import {SiteLayoutComponent} from './shared/layouts/site-layout/site-layout.component';

import {LoginPageComponent} from './login-page/login-page.component';
import {PrintersPageComponent} from './printers-page/printers-page.component';
import {ClientsPageComponent} from './clients-page/clients-page.component';
import {KeysService} from './shared/services/keys.service';
import {CreateUsersPageComponent} from './create-users-page/create-users-page.component';
import {ClientPrintersPageComponent} from './client-printers-page/client-printers-page.component';
import {UserPrintersPageComponent} from './user-printers-page/user-printers-page.component';
import {SettingsPageComponent} from './settings-page/settings-page.component';

const keys = new KeysService();

const routes: Routes = [{
  path: '',
  component: AuthLayoutComponent,
  children: [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginPageComponent}
  ]
},
  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      {
        path: 'printers',
        component: PrintersPageComponent,
        canActivate: [GuardServices],
        data: {role: keys.roles.admin.id}
      },
      {
        path: 'clients',
        component: ClientsPageComponent,
        canActivate: [GuardServices],
        data: {role: keys.roles.admin.id}
      },
      {
        path: 'create-users',
        component: CreateUsersPageComponent,
        canActivate: [GuardServices],
        data: {role: keys.roles.admin.id}
      },
      {
        path: 'settings',
        component: SettingsPageComponent,
        canActivate: [GuardServices],
        data: {role: keys.roles.admin.id}
      },
      {
        path: 'client-printers',
        component: ClientPrintersPageComponent,
        canActivate: [GuardServices],
        data: {role: keys.roles.client.id}
      },
      {
        path: 'user-printers',
        component: UserPrintersPageComponent,
        canActivate: [GuardServices],
        data: {role: keys.roles.user.id}
      }
    ]
  }];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
