import { Component, OnInit, Inject, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ExpensesService } from '../core/services/expenses.service';
import { Expenses } from './interfaces/expenses.interface';
import { UserExpenses } from './interfaces/userExpenses.interface';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { Router } from '@angular/router';
import { FormArray, FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css',
  imports: [CommonModule, HeaderComponent, GoogleMapsModule, ReactiveFormsModule], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})

export class ExpensesComponent implements OnInit {
  expenses: Expenses[] = [];
  user_expenses: UserExpenses[] = [];
  errorMessage: string = '';
  center = { lat: 39.720007, lng: 2.910419 };
  zoom = 13;
  mapOptions: google.maps.MapOptions = {
    mapId: 'DEMO_MAP_ID',
    disableDefaultUI: true,
  };
  map!: google.maps.Map;
  showForm: boolean = false;

  constructor(
    private expensesService: ExpensesService, 
    private fb: FormBuilder,
    private router: Router,
  ) {}
  
  expenseForm = this.fb.group({
    destination: [''], 
    description: [''], 
    totalAmount: [''], 
    date: [''], 
    paidByUser: [''],
    paidByName: [''], 
    userExpenses: this.fb.array([]),
  });
  
  ngOnInit(): void {
    this.expensesService.getExpensesByLoggedUser().subscribe({
      next: (data) => this.expenses = data.expenses,
      error: (err) => this.errorMessage = 'No se pudieron cargar los gastos.'
    });
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      const formData = this.expenseForm.value;
  
      const payload = {
        destination: formData.destination,
        description: formData.description,
        total_amount: parseFloat(formData.totalAmount || '0'),
        date: formData.date,
        paid_by_user: formData.paidByUser,
        paid_by_name: formData.paidByName,
        user_expenses: formData.userExpenses?.map((expense: any) => ({
          user: expense.user,
          user_name: expense.userName,
          amount_paid: parseFloat(expense.amountPaid),
          expected_share: parseFloat(expense.expectedShare),
          debt: parseFloat(expense.debt),
        })),
      };
  
      console.log('Payload to send:', payload);
  
      /* this.expensesService.createExpense(payload).subscribe({
        next: (response) => {
          console.log('Expense created successfully:', response);
          this.expenses.push(response); // Optionally update the local list of expenses
          this.showForm = false;
          this.expenseForm.reset();
        },
        error: (err) => {
          console.error('Error creating expense:', err);
        },
      }); */
    } else {
      console.error('Formulario inválido');
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  get userExpenses() {
    return this.expenseForm.get('userExpenses') as FormArray;
  }
  
  addUserExpense(): void {
    this.userExpenses.push(
      this.fb.group({
        user: [''], 
        userName: [''],
        amountPaid: [''],
        expectedShare: [''],
        debt: [''], 
      })
    );
  }
  
  removeUserExpense(index: number): void {
    this.userExpenses.removeAt(index);
  }

  getTotalExpenses(): number {
    return this.expenses.reduce((sum, expense) => sum + parseFloat(expense.total_amount as any || '0'), 0)
  }

  goToDestinations(itineraryId: number): void {
    this.router.navigate(['/destinations', itineraryId]);
  }
}
