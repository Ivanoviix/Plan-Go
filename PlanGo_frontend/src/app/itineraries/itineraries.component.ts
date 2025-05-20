import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ItinerariesService } from '../core/services/itineraries.service';
import { Itinerary } from './interfaces/itinerary.interface';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { Router } from '@angular/router';
import { MapComponent } from '../map/map.component';

@Component({
  standalone: true,
  selector: 'app-itineraries',
  templateUrl: './itineraries.component.html',
  styleUrls: ['./itineraries.component.css'],
  imports: [CommonModule, HeaderComponent, GoogleMapsModule, MapComponent, ReactiveFormsModule], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ItinerariesComponent implements OnInit {
  itineraries: Itinerary[] = [];
  errorMessage: string = '';
  showForm: boolean = false;
  itineraryForm: FormGroup;
  countries: { code: string; name: string }[] = [];

  constructor(
    private itinerariesService: ItinerariesService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.itineraryForm = this.fb.group({
      itineraryName: [''],
      countries: [[]],
      startDate: [''],
      endDate: [''],
    });
  }

  async ngOnInit(): Promise<void> {
    this.getItineraries();
    await this.getCountries();
    /* await this.addAdvancedMarker(this.center); */
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  onSubmit(): void {
    if (this.itineraryForm.valid) {
      const newItinerary = this.itineraryForm.value;
      console.log('Nuevo itinerario:', newItinerary);
  
      this.itinerariesService.createItinerary(newItinerary).subscribe({
        next: () => {
          this.getItineraries();
          this.showForm = false;
        },
        error: (err) => {
          console.error('Error al guardar el itinerario:', err);
        },
      });
    } else {
      console.error('Formulario inválido');
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.showForm) {
      this.showForm = false;
    }
  }

  async getCountries(): Promise<void> {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      this.countries = data
        .map((country: any) => ({
          code: country.cca2,
          name: country.name.common,
        }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name)); 
    } catch (error) {
      console.error('Error al obtener los países:', error);
    }
  }

  onCountriesChange(): void {
    const selectedCountries = this.itineraryForm.get('destinations')?.value || [];
    console.log('Países seleccionados:', selectedCountries);
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
          this.errorMessage = 'No se pudieron cargar los itinerarios.';
          console.error('Error al obtener itinerarios:', err);
        },
      });
    } catch (error) {
      console.error('Error al obtener itinerarios:', error);
      this.errorMessage = 'No se pudieron cargar los itinerarios.';
    }
  }

  goToDestinations(itineraryId: number): void {
    this.router.navigate(['/destinations', itineraryId]);
  }
}