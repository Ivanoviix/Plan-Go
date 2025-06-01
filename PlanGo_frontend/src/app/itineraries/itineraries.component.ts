import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItinerariesService } from '../core/services/itineraries.service';
import { Itinerary } from './interfaces/itinerary.interface';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { Router } from '@angular/router';
import { MapComponent } from '../map/map.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { switchMap } from 'rxjs';
import { globals } from '../core/globals';
import { BaseToastService } from '../core/services/base-toast.service';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { CustomValidators } from '../core/validators/custom-validators';
import { ValidatorMessages } from '../core/validators/validator-messages';

@Component({
  standalone: true,
  selector: 'app-itineraries',
  templateUrl: './itineraries.component.html',
  styleUrls: ['./itineraries.component.css'],
  imports: [
    CommonModule, 
    HeaderComponent, 
    GoogleMapsModule, 
    MapComponent, 
    ReactiveFormsModule, 
    NgSelectModule, 
    ToastModule,
    CalendarModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ItinerariesComponent implements OnInit {
  itineraries: Itinerary[] = [];
  errorMessage: string = '';
  showForm: boolean = false;
  itineraryForm: FormGroup;
  countries: { code: string; name: string }[] = [];
  currentDate: Date = new Date();
  ValidatorMessages = ValidatorMessages;
  formSubmitted = false;

  constructor(
    private itinerariesService: ItinerariesService,
    private router: Router,
    private fb: FormBuilder,
    private toast: BaseToastService
  ) {
    this.itineraryForm = this.fb.group({
      itineraryName: ['', Validators.required],
      countries: [[], Validators.required],
      startDate: [this.currentDate.toISOString().split('T')[0], Validators.required],
      endDate: ['', Validators.required],
    }, {
      validators: CustomValidators.endDateAfterStartDate()
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
    this.formSubmitted = true;
    if (this.itineraryForm.valid) {
      this.itinerariesService.getCsrfTokenFromServer().pipe(
        switchMap((csrfToken) => {
          this.itinerariesService.setCsrfToken(csrfToken);

          return this.itinerariesService.getIdUser().pipe(
            switchMap((userId) => {
              let countries = this.itineraryForm.get('countries')?.value.map((country: string) => country);

              let newItinerary: Itinerary = {
                itinerary_name: this.itineraryForm.get('itineraryName')?.value,
                creator_user: userId,
                creation_date: new Date().toISOString().split('T')[0],
                start_date: this.itineraryForm.get('startDate')?.value,
                end_date: this.itineraryForm.get('endDate')?.value,
                countries: countries, // Enviar como array
              };
              this.toast.showSuccessToast('Se han añadido el itinerario', false);
              return this.itinerariesService.createItinerary(newItinerary);
            })
          );
        })
      ).subscribe({
        next: (response) => {
          console.log('Itinerario creado exitosamente:', response);
          this.getItineraries();
          this.showForm = false;
        },
        error: (err) => {
          console.error('Error al guardar el itinerario:', err);
        },
      });
      this.formSubmitted = false;
    } else {
      this.itineraryForm.markAllAsTouched();
    this.itineraryForm.updateValueAndValidity(); 
    console.error('Formulario inválido');
    }
  }
  
  getItineraries(): void {
    this.itinerariesService.getItineraries().subscribe({
      next: (data: { itineraries: Itinerary[] }) => {
        console.log('Datos recibidos:', data);
        this.itineraries = data.itineraries;
      },
      error: (err: any) => {
        this.errorMessage = 'No se pudieron cargar los itinerarios.';
        console.error('Error al obtener itinerarios:', err);
      }
    });
  }

  async getCountries(): Promise<void> {
    try {
      let response = await fetch(globals.countriesRest);
      let data = await response.json();
      this.countries = data
        .map((country: any) => ({
          code: country.cca2,
          name: country.translations?.spa?.common || country.name.common, 
        }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error al obtener los países:', error);
    }
  }

  onCountriesChange(): void {
    let selectedCountries = this.itineraryForm.get('destinations')?.value || [];
    console.log('Países seleccionados:', selectedCountries);
  }
  /* onMapReady(map: google.maps.Map): void {
    this.map = map;
  
    this.map.addListener('dblclick', async (event: google.maps.MapMouseEvent) => {
      if (event.latLng) await this.addAdvancedMarker(event.latLng);
    });
  } */

  /* async addAdvancedMarker(position: google.maps.LatLng | google.maps.LatLngLiteral): Promise<void> {
    let { AdvancedMarkerElement } = await google.maps.importLibrary(
      'marker'
    ) as google.maps.MarkerLibrary;
  
    let marker = new AdvancedMarkerElement({
      map: this.map,
      position: position,
      title: 'Nuevo marcador',
    });
  } */

  goToDestinations(itineraryId: number | undefined): void {
    this.router.navigate(['/destinations', itineraryId]);
  }
}
  
  /* onMapReady(map: google.maps.Map): void {
    this.map = map;
  
    this.map.addListener('dblclick', async (event: google.maps.MapMouseEvent) => {
      if (event.latLng) await this.addAdvancedMarker(event.latLng);
    });
  } */
  
  /* async addAdvancedMarker(position: google.maps.LatLng | google.maps.LatLngLiteral): Promise<void> {
    let { AdvancedMarkerElement } = await google.maps.importLibrary(
      'marker'
    ) as google.maps.MarkerLibrary;
  
    let marker = new AdvancedMarkerElement({
      map: this.map,
      position: position,
      title: 'Nuevo marcador',
    });
  } */