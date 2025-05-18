import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ItinerariesService } from '../core/services/itineraries.service'; // Ruta corregida
import { Itinerary } from './interfaces/itinerary.interface'; 
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  standalone: true,
  selector: 'app-itineraries',
  templateUrl: './itineraries.component.html',
  styleUrls: ['./itineraries.component.css'],
  imports: [CommonModule, HeaderComponent, GoogleMapsModule], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ItinerariesComponent implements OnInit {
  itineraries: Itinerary[] = [];
  errorMessage: string = '';
  center = { lat: 39.720007, lng: 2.910419 };
  zoom = 13;
  mapOptions: google.maps.MapOptions = {
    mapId: 'DEMO_MAP_ID',
    disableDefaultUI: true,
  };
  map!: google.maps.Map;

  constructor(private itinerariesService: ItinerariesService) {}

  async ngOnInit(): Promise<void> {
    this.getItineraries();
    /* await this.addAdvancedMarker(this.center); */
  }

  /* onMapReady(map: google.maps.Map): void {
    this.map = map;
  
    this.map.addListener('dblclick', async (event: google.maps.MapMouseEvent) => {
      if (event.latLng) await this.addAdvancedMarker(event.latLng);
    });
  } */
  
  /* async addAdvancedMarker(position: google.maps.LatLng | google.maps.LatLngLiteral): Promise<void> {
    const { AdvancedMarkerElement } = await google.maps.importLibrary(
      'marker'
    ) as google.maps.MarkerLibrary;
  
    const marker = new AdvancedMarkerElement({
      map: this.map,
      position: position,
      title: 'Nuevo marcador',
    });
  } */

  async getItineraries(): Promise<void> {
    try {
      const observable = await this.itinerariesService.getItineraries();
      observable.subscribe({
        next: (data: { itineraries: Itinerary[] }) => {
          console.log('Datos recibidos:', data);
          this.itineraries = data.itineraries;
        },
        error: (err: any) => {
          console.error('Error al obtener itinerarios:', err);
          this.errorMessage = 'No se pudieron cargar los itinerarios.';
        },
      });
    } catch (error) {
      console.error('Error al obtener itinerarios:', error);
      this.errorMessage = 'No se pudieron cargar los itinerarios.';
    }
  }
}