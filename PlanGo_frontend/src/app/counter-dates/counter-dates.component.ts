import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
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
  @Input() days: number = 1;
  @Input() startDateStr: string = '';
  @Input() itineraryStartDate!: string;
  @Input() itineraryTotalDays!: number;
  @Input() otherOccupiedDays: number = 0;
  @Input() destinationStartDate!: string;
  @Output() maxDaysReached = new EventEmitter<void>();
  @Output() fechasConfirmadas = new EventEmitter<{ idDestino: number; fechaInicio: string; fechaFin: string }>();
  @Output() reloadDestination = new EventEmitter<number>();
  count: number = 1;
  readonly radius: number = 16; // Radio del círculo
  readonly circumference: number = 2 * Math.PI * this.radius; // Circunferencia del círculo

  constructor(
    private destinationService: DestinationService,
  ) { }

  ngOnInit() {
    this.count = this.days;
    console.log('startDateStr recibido:', this.startDateStr);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['days'] && !changes['days'].firstChange) {
      this.count = changes['days'].currentValue;
    }
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
    console.log('Fechas enviadas:', datos);
    this.fechasConfirmadas.emit(datos);
  }

  increment(): void {
    if (
      this.count < this.itineraryTotalDays &&
      (this.count + this.otherOccupiedDays) < this.itineraryTotalDays
    ) {
      this.count++;
      const newEndDate = this.formatDate(this.endDate);
      this.destinationService.updateDateDestination(this.idDestino, { end_date: newEndDate })
        .pipe(take(1))
        .subscribe({
          next: () => this.confirmarFechas(),
          error: (err) => console.error('Error actualizando end_date:', err)
        });
    } else {
      this.maxDaysReached.emit();
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
          },
          error: (err) => console.error('Error actualizando end_date:', err)
        });
    } 
  }

}