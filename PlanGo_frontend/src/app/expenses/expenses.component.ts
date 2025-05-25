import { Component, OnInit, Inject, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { DestinationService } from '../core/services/destinations.service';
import { ItinerariesService } from '../core/services/itineraries.service';
import { ParticipantsService } from '../core/services/participants.service';
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
  imports: [CommonModule, HeaderComponent, GoogleMapsModule, ReactiveFormsModule], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})

export class ExpensesComponent implements OnInit {
  itineraries: any[] = [];
  destinations: any[] = [];
  selectedItineraryId: number | null = null;
  selectedDestinationId: number | null = null;
  expenses: Expenses[] = [];
  participants: any[] = [];
  expenseForm: FormGroup;
  showForm: boolean = false;
  errorMessage: string = '';
  center = { lat: 39.720007, lng: 2.910419 };
  zoom = 13;
  map!: google.maps.Map;
  selectedDestination: any = null;
  mapOptions: google.maps.MapOptions = {
    mapId: 'DEMO_MAP_ID',
    disableDefaultUI: true,
  };


  constructor(private expensesService: ExpensesService, private destinationService: DestinationService, private itinerariesService: ItinerariesService, private participantsService: ParticipantsService, private router: Router, private formBuilder: FormBuilder) {
    this.expenseForm = this.formBuilder.group({
      itinerary: [null, Validators.required],
      destination: [null, Validators.required],
      payer: [null, Validators.required],
      total_amount: ['', Validators.required],
      description: ['', Validators.required],
      date: [null],
      type_expense: ['Personalized', Validators.required],
      debtors: this.formBuilder.array([]),
    });
  }

  async ngOnInit(): Promise<void> {

    this.expensesService.getExpensesByLoggedUser().subscribe({
      next: (data) => this.expenses = data.expenses,
      error: (err) => this.errorMessage = 'No se pudieron cargar los gastos.'
    });
    
    this.destinationService.getDestinations().subscribe({
      next: (data) => this.destinations = data,
      error: (err) => this.errorMessage = 'No se pudieron cargar los destinos.'
    })

    this.itinerariesService.getItineraries().subscribe({
        next: (data: any) => this.itineraries = data.itineraries,
        error: (err: any) => this.itineraries = []
      });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      const formValue = this.expenseForm.value;
      const payerId = Number(formValue.payer);
      const payer = this.participants.find(p => p.participant_id === payerId);

      // Pagador: si es -1 es el usuario, si no es participante invitado
      const paid_by_user = payer?.participant_id === -1 ? payer.user : null;
      const paid_by_name = payer?.participant_id === -1 ? null : payer.participant_name;

      // Deudores: solo el usuario autenticado lleva user, los demás llevan user_name
      const debtors = formValue.debtors.map((debtor: any) => {
        const participant = this.participants.find(p => p.participant_id === Number(debtor.id));
        return {
          participant_id: Number(debtor.id),
          user: participant?.participant_id === -1 ? participant.user : null,
          user_name: participant?.participant_id === -1 ? null : participant?.participant_name,
          amount: debtor.amount
        };
      });

      const newExpense = {
        itinerary: formValue.itinerary,
        destination: formValue.destination,
        paid_by_user,
        paid_by_name,
        total_amount: formValue.total_amount,
        description: formValue.description,
        date: formValue.date,
        type_expense: formValue.type_expense,
        debtors
      };

      this.expensesService.createExpense(newExpense).subscribe({
        next: () => {
          this.getTotalExpenses();
          this.showForm = false;
        },
        error: (err) => {
          console.error('Error al guardar el gasto:', err);
        },
      });
    } else {
      console.error("Formulario inválido", this.expenseForm.errors, this.expenseForm.value);
      this.expenseForm.markAllAsTouched();
    }
  }
  
  goToDestinations(itineraryId: number): void {
    this.router.navigate(['/destinations', itineraryId]);
  }

  getTotalExpenses(): number {
    return this.expenses.reduce((sum, expense) => sum + parseFloat(expense.total_amount as any || '0'), 0)
  }

  getSelectedDestination(destinationId: Expenses): void {
    this.selectedDestination = this.destinations.find(dest => dest.destination_id === destinationId);
    console.log("DESTINO SELECCIONADO!: ",this.selectedDestination)
    /*const expense = {
      date: "2025-05-16",
      description: "Billares y cervezas ROCKZ",
      destination_name: "Potsdam",
      expense_id: 2,
      itinerary_name: "Tu mama",
      paid_by_name: null,
      paid_by_user: 12,
      total_amount: "31.31",
      type_expense: "Equalitarian"
    };*/
  }

  onItineraryChange(): void {
    const itineraryId = this.expenseForm.value.itinerary;
    if (itineraryId) {
      this.destinationService.getDestinationsByItinerary(itineraryId).subscribe({
        next: (data: any) => {
          // Asegúrate de que destinations es un array
          this.destinations = Array.isArray(data) ? data : data['User destinations'] || [];
        },
        error: (err: any) => this.destinations = []
      });
    } else {
      this.destinations = [];
    }
    this.selectedDestinationId = null;
  }

    
  onDestinationsChange(): void {
    
    const destinationId = this.expenseForm.value.destination;
    if (destinationId) {
      this.selectedDestinationId = destinationId;
      this.loadParticipants(destinationId);
    } else {
      this.selectedDestinationId = null;
      this.participants = [];
    }
  }

  onPayerChange(): void {
    const debtorsArray = this.expenseForm.get('debtors') as FormArray;
    debugger
    debtorsArray.clear();
  }

  loadParticipants(destinationId: number): void {
    this.participantsService.getParticipantsByDestination(destinationId).subscribe({
      next: (data: any) => {
        let participants = Array.isArray(data.Participants) ? data.Participants : [];
        // Asigna participant_id = -1 al usuario autenticado si es null
        this.participants = participants.map((p: any) =>
          p.participant_id === null ? { ...p, participant_id: -1 } : p
        );
      },
      error: () => this.participants = [],
    });
  }

  get debtorsControls() {
    return (this.expenseForm.get('debtors') as FormArray).controls;
  }
  
  get possibleDebtors() {
    const payerId = this.expenseForm?.value?.payer;
    debugger
    return this.participants.filter(p => (p.user || p.participant_id) !== payerId);
  }


  addDebtor(): void {
    const debtorsArray = this.expenseForm.get('debtors') as FormArray;
    debtorsArray.push(this.formBuilder.group({
      id: [null, Validators.required],
      amount: ['', Validators.required]
    }));
  }

  removeDebtor(index: number): void {
    const debtorsArray = this.expenseForm.get('debtors') as FormArray;
    debtorsArray.removeAt(index);
  }

  getPossibleDebtors(i: number): any[] {
    const payerParticipantId = String(this.expenseForm.get('payer')?.value);
    const debtorsArray = this.expenseForm.get('debtors') as FormArray;
    const selectedIds = debtorsArray.controls
      .map((ctrl, idx) => idx !== i ? String(ctrl.value.id) : null)
      .filter(id => id !== null); 
      console.log('Payer ID:', payerParticipantId);
      console.log('Selected debtor IDs:', selectedIds);
      console.log('All participants:', this.participants);
    return this.participants.filter(p => {
      const id = String(p.participant_id);
      return id !== payerParticipantId && !selectedIds.includes(id);
    });
  }
}
