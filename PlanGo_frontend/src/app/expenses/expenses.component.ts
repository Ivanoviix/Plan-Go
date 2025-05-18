import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ExpensesService } from '../core/services/expenses.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-expenses',
  standalone: true,
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css',
  imports: [CommonModule, HeaderComponent], 
})
export class ExpensesComponent implements OnInit {
  expenses: any[] = [];
  errorMessage = '';

  constructor(private expensesService: ExpensesService) {}

  ngOnInit(): void {
    this.expensesService.getExpensesByLoggedUser().subscribe({
      next: (data) => this.expenses = data.expenses,
      error: (err) => this.errorMessage = 'No se pudieron cargar los gastos.'
    });
  }
}
