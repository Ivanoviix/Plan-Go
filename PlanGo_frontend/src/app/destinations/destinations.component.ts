import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { DestinationService } from '../core/services/destinations.service';
import { ParticipantsComponent } from '../participants/participants.component';
import { Destination } from './interfaces/destinations.interface'; 
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapComponent } from '../map/map.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CounterDatesComponent } from '../counter-dates/counter-dates.component';
import { forkJoin, map, Observable } from 'rxjs';

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
  errorMessage: string = '';
  selectedItineraryId: number | null = null;
  summary: { [key: number]: any } = {};
  countries: any[] = [];
  allCountries: { code: string, name: string }[] = [];
  searchText: string = '';
  cities: string[] = [];

constructor(private destinationService: DestinationService, private route: ActivatedRoute) {}

  ngOnInit(): void { // La idea es que al pulsar un itinerario, recibe su id y muestra destino / destinos
    this.route.paramMap.subscribe(params => {
      const itineraryId = Number(params.get('itineraryId'));
      if (itineraryId) {
        this.fetchDestinationsByItinerary(itineraryId);
      }
    });
  }

  guardarFechas(event: { idDestino: number; fechaInicio: string; fechaFin: string }): void {
    console.log('Fechas confirmadas:', event);
    // Handle the event here (e.g., save to the database or update the UI)
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

  fetchCountriesByDestination(destinationId: number): void {
    this.destinationService.getCountriesByDestination(destinationId).subscribe({
      next: (data: any) => {
        this.countries = data.countries;
      error: () => {
        this.countries = [];
        console.log("No hay países en su destino")
      }
      }
    })
  }

  async getCountries(): Promise<void> {
    try {
      let response = await fetch('https://restcountries.com/v3.1/all');
      let data = await response.json();
      this.allCountries = data
        .map((country: any) => ({
          code: country.cca2,
          name: country.name.common,
        }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error al obtener los países:', error);
    }
  }

  getCountryCodesByNames(names: string[]): string[] {
    return this.allCountries
      .filter(c => names.includes(c.name))
      .map(c => c.code);
  }

  getCitiesMultipleCountries(input: string, countryCodes: string[]): Observable<string[]> {
    const calls = countryCodes.map(code => this.destinationService.getCitiesFromGoogle(input, code));
    return forkJoin(calls).pipe(
      map(results =>
        results.flatMap(r => r.predictions.map((p: any) => p.description))
      )
    );
  }

  onCitySearch() {
    const countryCodes = this.getCountryCodesByNames(this.countries);
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
  


}
