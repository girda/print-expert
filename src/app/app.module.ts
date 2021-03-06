import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

import {AppRoutingModule} from './app-routing.module';
import {LoginPageComponent} from './login-page/login-page.component';
import {AuthLayoutComponent} from './shared/layouts/auth-layout/auth-layout.component';
import {SiteLayoutComponent} from './shared/layouts/site-layout/site-layout.component';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import {MatTableModule} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import {PrintersPageComponent} from './printers-page/printers-page.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {SelectSearchComponent} from './shared/components/select-search/select-search.component';
import {AgGridModule} from 'ag-grid-angular';
import {ClientsPageComponent} from './clients-page/clients-page.component';
import {PopupComponent} from './shared/components/popup/popup.component';
import {TokenInterceptor} from './shared/services/token-interceptor.service';
import {FilterPrintersComponent} from './shared/components/filter-printers/filter-printers.component';
import {CreateUsersPageComponent} from './create-users-page/create-users-page.component';
import {PopupCreateUserComponent} from './shared/components/popup-create-user/popup-create-user.component';
import { ClientPrintersPageComponent } from './client-printers-page/client-printers-page.component';
import { UserPrintersPageComponent } from './user-printers-page/user-printers-page.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { InputFilterComponent } from './shared/components/input-filter/input-filter.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    PrintersPageComponent,
    SelectSearchComponent,
    ClientsPageComponent,
    PopupComponent,
    FilterPrintersComponent,
    CreateUsersPageComponent,
    PopupCreateUserComponent,
    ClientPrintersPageComponent,
    UserPrintersPageComponent,
    SettingsPageComponent,
    InputFilterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatGridListModule,
    MatNativeDateModule,
    NgxMatSelectSearchModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    MatListModule,
    MatTableModule,
    AgGridModule.withComponents([]),
  ],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'uk-UA'
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
