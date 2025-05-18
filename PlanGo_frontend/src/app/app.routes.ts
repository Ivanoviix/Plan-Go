import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ItinerariesComponent } from './itineraries/itineraries.component';
import { DestinationsComponent} from './destinations/destinations.component';
import { ExpensesComponent } from './expenses/expenses.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'register', component: RegisterComponent, data: { animation: 'RegisterPage' } },
  { path: 'itineraries', component: ItinerariesComponent },
  //{ path: 'destinations', component: DestinationsComponent },
  { path: 'destinations/:itineraryId', component: DestinationsComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];