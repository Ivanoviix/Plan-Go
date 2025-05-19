import { Component, OnInit, Inject, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ExpensesService } from '../core/services/expenses.service';
import { Expenses } from './interfaces/expenses.interface';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css',
  imports: [CommonModule, HeaderComponent, GoogleMapsModule], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})

export class ExpensesComponent implements OnInit {
  expenses: Expenses[] = [];
  errorMessage: string = '';
  center = { lat: 39.720007, lng: 2.910419 };
  zoom = 13;
  mapOptions: google.maps.MapOptions = {
    mapId: 'DEMO_MAP_ID',
    disableDefaultUI: true,
  };
  map!: google.maps.Map;

  constructor(private expensesService: ExpensesService, private router: Router) {}

  ngOnInit(): void {
    this.expensesService.getExpensesByLoggedUser().subscribe({
      next: (data) => this.expenses = data.expenses,
      error: (err) => this.errorMessage = 'No se pudieron cargar los gastos.'
    });
  }

  getTotalExpenses(): number {
    return this.expenses.reduce((sum, expense) => sum + parseFloat(expense.total_amount as any || '0'), 0)
  }

  goToDestinations(itineraryId: number): void {
    this.router.navigate(['/destinations', itineraryId]);
  }
}
