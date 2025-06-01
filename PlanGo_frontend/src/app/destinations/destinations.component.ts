import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { DestinationService } from '../core/services/destinations.service';
import { ParticipantsComponent } from '../participants/participants.component';
import { Destination } from './interfaces/destinations.interface'; 
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapComponent } from '../map/map.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CounterDatesComponent } from '../counter-dates/counter-dates.component';
import { ItinerariesService } from '../core/services/itineraries.service';
import { forkJoin, map, Observable, filter, distinctUntilChanged } from 'rxjs';
import { globals } from '../core/globals';

@Component({
  standalone: true,
  selector: 'app-destinations',
  templateUrl: './destinations.component.html',
  styleUrl: './destinations.component.css',
  imports: [
    CommonModule, 
    FormsModule, 
    HeaderComponent, 
    ParticipantsComponent, 
    GoogleMapsModule, 
    MapComponent, 
    NgSelectModule, 
    CounterDatesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 

})
export class DestinationsComponent implements OnInit {
  destinations: Destination[] = [];
  selectedItinerary: any = null;
  errorMessage: string = '';
  selectedItineraryId: number | null = null;
  summary: { [key: number]: any } = {};
  countries: any[] = [];
  allCountries: { code: string, name: string }[] = [];
  searchText: string = '';
  cities: string[] = [];

constructor(
  private destinationService: DestinationService, 
  private route: ActivatedRoute,
  private router: Router,
  private itineraryService: ItinerariesService,
) {}

  async ngOnInit() { // La idea es que al pulsar un itinerario, recibe su id y muestra destino / destinos
    await this.getCountries();
   /*  this.route.paramMap.subscribe(params => {
      let itineraryId = Number(params.get('itineraryId'));
      if (itineraryId) {
        this.fetchDestinationsByItinerary(itineraryId);
        this.fetchCountriesByItinerary(itineraryId);
        this.selectedItineraryId = itineraryId;
      }
    }); */

    this.route.paramMap.pipe(
      map((params): number => Number(params.get('itineraryId'))), 
      filter((itineraryId: number) => !!itineraryId), 
      distinctUntilChanged() 
    ).subscribe((itineraryId: number) => {
      console.log('Fetching itinerary with ID:', itineraryId);
      this.fetchItineraryDetails(itineraryId);
      this.fetchDestinationsByItinerary(itineraryId);
      this.fetchCountriesByItinerary(itineraryId);
      this.selectedItineraryId = itineraryId;
    });
  }

  // CUAL DE LAS 2 ES LA QUE SE UTILIZA?
  fetchItineraryDetails(itineraryId: number): void {
    if (this.selectedItineraryId === itineraryId) return;
  
    this.selectedItineraryId = itineraryId; // Actualiza el ID seleccionado
    this.itineraryService.getItineraryById(itineraryId).subscribe({
      next: (itinerary: any) => {
        console.log('Itinerary data:', itinerary);
        this.selectedItinerary = itinerary;
      },
      error: (err: any) => {
        console.error('Error fetching itinerary:', err);
        this.selectedItinerary = null;
      }
    });
  }

  guardarFechas(event: { idDestino: number; fechaInicio: string; fechaFin: string }): void {
    console.log('Fechas confirmadas:', event);
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

  fetchCountriesByItinerary(itineraryId: number): void {
    this.destinationService.getCountriesByItinerary(itineraryId).subscribe({
      next: (data: any) => {
        this.countries = data.countries;
      },
      error: () => {
        this.countries = [];
        console.log("No hay países en su destino")
      }
    });
  }

  getTotalExpenses(): number {
    return this.destinations.reduce((sum, dest) => {
      let resumen = this.summary[dest.destination_id];
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

  fetchCountriesByDestination(destinationId: number): void {
    this.destinationService.getCountriesByDestination(destinationId).subscribe({
      next: (data: any) => {
        this.countries = data.countries;
      },
      error: () => {
        this.countries = [];
        console.log("No hay países en su destino");
      }
    });
  }

  async getCountries(): Promise<void> {
    try {
      let response = await fetch(globals.countriesRest)
      let data = await response.json();
      this.allCountries = data
        .map((country: any) => ({
          code: country.cca2,
          name: country.translations?.spa?.common || country.name.common,
        }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error al obtener los países:', error);
    }
  }

  getCountryCodesByNames(names: string[]): string[] {
    return this.allCountries
    .filter(c => names.some(n => n.trim().toLowerCase() === c.name.trim().toLowerCase()))
    .map(c => c.code)
  }
  
  getCitiesMultipleCountries(input: string, countryCodes: string[]): Observable<string[]> {
    let calls = countryCodes.map(code => this.destinationService.getCitiesFromGoogle(input, code));
    return forkJoin(calls).pipe(
      map(results =>
        results.flatMap(r => r.geonames ? r.geonames.map((g: any) => g.name) : []
      )
      )
    );
  }
  
  onCitySearch() {
    let countryCodes = this.getCountryCodesByNames(this.countries);
    console.log('Texto buscado:', this.searchText);
    console.log('Países (names):', this.countries);
    console.log('Códigos de país:', countryCodes);
    if (this.searchText && countryCodes.length > 0) {
      this.getCitiesMultipleCountries(this.searchText, countryCodes).subscribe({
        next: (results: string[]) => this.cities = results,
        error: () => this.cities = [],
      });
    } else {
      this.cities = [];
      console.log("No se ha escrito nada en el input")
    }
  }
  
formatCountries(): string {
    if (!this.selectedItinerary?.countries) return '';
  
    let countriesArray = this.selectedItinerary.countries.split(',');
    let length = countriesArray.length;
  
    if (length === 2) {
      return countriesArray.join(' y ');
    } else if (length > 2) {
      let lastCountry = countriesArray.pop();
      return `${countriesArray.join(', ')} y ${lastCountry}`;
    }
    return this.selectedItinerary.countries; 
  }

  goPlaces(destinationId: number): void {
    this.router.navigate(['/search/places', this.selectedItineraryId], {
      queryParams: { destinationId }
    });
  }
}