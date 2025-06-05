import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DestinationService } from '../core/services/destinations.service';
import { take, delay } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-day-counter',
  templateUrl: './counter-dates.component.html',
  styleUrls: ['./counter-dates.component.css']
})
export class CounterDatesComponent {
  @Input() city: string = 'Ciudad';
  @Input() idDestino!: number;
  @Input() max: number = 5;
  @Input() startDateStr: string = '2025-06-01';
  @Input() itineraryStartDate!: string; 
  @Input() itineraryTotalDays!: number;
  @Output() fechasConfirmadas = new EventEmitter<{ idDestino: number; fechaInicio: string; fechaFin: string }>();
  @Output() reloadDestination = new EventEmitter<number>();
  count: number = 1;
  readonly radius: number = 16; // Radio del círculo
  readonly circumference: number = 2 * Math.PI * this.radius; // Circunferencia del círculo

  constructor(
    private destinationService: DestinationService,
  ) {}
  
  ngOnInit() {
    
  }
  get startDate(): Date {
    return new Date(this.itineraryStartDate || this.startDateStr);
  }

  get endDate(): Date {
    const end = new Date(this.startDate);
    end.setDate(end.getDate() + this.count - 1);
    return end;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  confirmarFechas(): void {
    const datos = {
      idDestino: this.idDestino,
      fechaInicio: this.formatDate(this.startDate),
      fechaFin: this.formatDate(this.endDate),
    };
    this.fechasConfirmadas.emit(datos);
  }

  
  increment(): void {
    if (this.count < this.itineraryTotalDays) {
      this.count++;
      const newEndDate = this.formatDate(this.endDate);
      this.destinationService.updateDateDestination(this.idDestino, { end_date: newEndDate })
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.confirmarFechas();
            // this.reloadDestination.emit(this.idDestino); // Quita o comenta esta línea
          },
          error: (err) => console.error('Error actualizando end_date:', err)
        });
    }
  }

  decrement(): void {
    if (this.count > 1) {
      this.count--;
      const newEndDate = this.formatDate(this.endDate);
      this.destinationService.updateDateDestination(this.idDestino, { end_date: newEndDate })
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.confirmarFechas();
            // this.reloadDestination.emit(this.idDestino); // Quita o comenta esta línea
          },
          error: (err) => console.error('Error actualizando end_date:', err)
        });
    }
  }
}