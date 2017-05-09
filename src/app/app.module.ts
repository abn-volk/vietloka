import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Route, RouterModule }   from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core'

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { ProfileComponent } from './profile.component';
import { AboutComponent } from './about.component';
import { HouseComponent } from './house.component';
import { VerifyComponent } from './verify.component';
import { PublishComponent } from './publish.component';
import { SearchComponent } from './search.component';

import { UserService } from './user.service';
import { GeocodingService } from './geocoding.service';
import { HouseService } from './house.service';
import { RentService } from './rent.service';
import { TokenGuard, NonLoggedInGuard, GuestGuard, HostGuard, UnverifiedGuard } from './guards';


const routes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NonLoggedInGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NonLoggedInGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'house/:id',
    component: HouseComponent,
  },
  {
    path: 'publish',
    component: PublishComponent,
    canActivate: [TokenGuard, HostGuard]
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'verify',
    component: VerifyComponent,
    canActivate: [TokenGuard, UnverifiedGuard]
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    HouseComponent,
    PublishComponent,
    SearchComponent,
    VerifyComponent,
    AboutComponent
  ],
  imports: [
    NgbModule.forRoot(),
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyDGwHWYBuey33KjRe7J9xqyHnZLPTXe6JA'})
  ],
  providers: [
    UserService,
    GeocodingService,
    HouseService,
    RentService,
    TokenGuard,
    NonLoggedInGuard,
    GuestGuard,
    HostGuard,
    UnverifiedGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
