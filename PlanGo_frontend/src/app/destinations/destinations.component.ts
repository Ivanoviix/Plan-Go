import { Component, OnInit } from '@angular/core';
import { DestinationService } from '../core/services/destinations.service'; // Ruta corregida
import { Destination } from './interfaces/destinations.interface'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-destinations',
  templateUrl: './destinations.component.html',
  styleUrl: './destinations.component.css',
  imports: [CommonModule, FormsModule], 

})
export class DestinationsComponent implements OnInit {
  destinations: Destination[] = [];
  errorMessage: string = '';
  selectedItineraryId: number | null = null; // <-- Añade esto

  constructor(private destinationService: DestinationService) {}

ngOnInit(): void {
  this.fetchDestinationsByItinerary(1); // PRUEBA CON itinerary_id 1
}
  fetchDestinationsByItinerary(itineraryId: number): void {
    this.destinationService.getDestinationsByItinerary(itineraryId).subscribe({
      next: (data: any) => {
        console.log('Respuesta del backend:', data);
        this.destinations = data['User destinations'] || [];
      },
      error: (err: any) => {
        this.errorMessage = 'No se pudieron cargar los destinos.';
        console.error(err);
      }
    });
  }
}
