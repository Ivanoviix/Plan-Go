import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ItinerariesComponent } from './itineraries/itineraries.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'register', component: RegisterComponent, data: { animation: 'RegisterPage' } },
  { path: 'itineraries', component: ItinerariesComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];