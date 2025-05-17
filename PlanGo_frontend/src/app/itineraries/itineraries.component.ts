import { Component, OnInit } from '@angular/core';
import { ItinerariesService } from '../core/services/itineraries.service'; // Ruta corregida
import { Itinerary } from './interfaces/itinerary.interface'; 
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-itineraries',
  templateUrl: './itineraries.component.html',
  styleUrls: ['./itineraries.component.css'],
  imports: [CommonModule], 
})
export class ItinerariesComponent implements OnInit {
  itineraries: Itinerary[] = [];
  errorMessage: string = '';

  constructor(private itinerariesService: ItinerariesService) {}

  ngOnInit(): void {
    this.fetchItineraries();
  }

  fetchItineraries(): void {
    this.itinerariesService.getItineraries().subscribe({
      next: (data: { itineraries: Itinerary[] }) => {
        console.log('Datos recibidos:', data);
        this.itineraries = data.itineraries;
      },
      error: (err: any) => {
        console.error('Error al obtener itinerarios:', err);
        this.errorMessage = 'No se pudieron cargar los itinerarios.';
      },
    });
  }
}