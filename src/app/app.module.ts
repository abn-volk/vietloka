import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Route, RouterModule }   from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { ProfileComponent } from './profile.component';
import { AboutComponent } from './about.component';
import { VerifyComponent } from './verify.component';
import { PublishComponent } from './publish.component';

import { UserService } from './user.service';
import { TokenGuard, GuestGuard, HostGuard, UnverifiedGuard } from './guards';


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
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'publish',
    component: PublishComponent,
    canActivate: [TokenGuard, HostGuard]
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
    PublishComponent,
    VerifyComponent,
    AboutComponent
  ],
  imports: [
    NgbModule.forRoot(),
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule
  ],
  providers: [UserService, 
    TokenGuard, 
    GuestGuard, 
    HostGuard,
    UnverifiedGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
