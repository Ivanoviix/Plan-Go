import { Component, OnInit } from '@angular/core';
import { DestinationService } from '../core/services/destinations.service';
import { Destination } from './interfaces/destinations.interface'; 
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  selector: 'app-destinations',
  templateUrl: './destinations.component.html',
  styleUrl: './destinations.component.css',
  imports: [CommonModule, FormsModule, HeaderComponent], 

})
export class DestinationsComponent implements OnInit {
  destinations: Destination[] = [];
  errorMessage: string = '';
  selectedItineraryId: number | null = null;
  summary: { [key: number]: any } = {};

constructor(private destinationService: DestinationService, private route: ActivatedRoute) {}

  ngOnInit(): void { // La idea es que al pulsar un itinerario, recibe su id y muestra destino / destinos
    this.route.paramMap.subscribe(params => {
      const itineraryId = Number(params.get('itineraryId'));
      if (itineraryId) {
        this.fetchDestinationsByItinerary(itineraryId);
      }
    });
  }
  
  fetchDestinationsByItinerary(itineraryId: number): void {

  this.destinationService.getDestinationsByItinerary(itineraryId).subscribe({
    next: (data: any) => {

      this.destinations = data['User destinations'] || [];
      this.destinations.forEach(dest => {
        this.fetchDestinationSummary(dest.destination_id);
      });
    },
    error: (err: any) => {
      this.errorMessage = 'No se pudieron cargar los destinos.';
      console.error(err);
    }
  });
}
  getTotalExpenses(): number {
    return this.destinations.reduce((sum, dest) => {
      const resumen = this.summary[dest.destination_id];
      return sum + (resumen ? resumen.total_expenses || 0 : 0);
    }, 0);
  }

  fetchDestinationSummary(destinationId: number): void {
    this.destinationService.getDestinationSummary(destinationId).subscribe({
      next: (data: any) => {
        this.summary[destinationId] = data;
      },
      error: (err: any) => {
        this.summary[destinationId] = null;
        console.error('No se pudo cargar el resumen del destino', err);
      }
    });
  }

}
