import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { trigger, style, transition, animate, state } from '@angular/animations';
import { HeaderComponent } from "../header/header.component";
import { MapComponent } from "../map/map.component";
import { ParticipantsComponent } from "../participants/participants.component";
import { FormsModule } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Destination } from "../destinations/interfaces/destinations.interface";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { DestinationService } from "../core/services/destinations.service";
import { BaseToastService } from '../core/services/base-toast.service';
import { SearchPlacesService } from '../core/services/search-places.service';
import { ApiKeyService } from "../core/services/api-key.service";
import { BackButtonComponent } from '../core/back-button/back-button.component';
import { ViewChild } from '@angular/core';
import { ToastModule } from "primeng/toast";
import { ItinerariesService } from "../core/services/itineraries.service";


@Component({
  selector: 'app-search-places',
  standalone: true,
  templateUrl: './search-places.component.html',
  styleUrl: './search-places.component.css',
  imports: [
    CommonModule,
    HeaderComponent,
    MapComponent,
    ParticipantsComponent,
    FormsModule,
    BackButtonComponent,
    ToastModule,
  ],
  animations: [
    trigger('accordionContent', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden' }),
        animate('300ms cubic-bezier(0.4,0,0.2,1)', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('300ms cubic-bezier(0.4,0,0.2,1)', style({ height: 0, opacity: 0, overflow: 'hidden' })),
      ]),
    ]),
    trigger('hoverAnimation', [
      state('default', style({ transform: 'scale(1)' })),
      state('hover', style({ transform: 'scale(1.1)' })),
      transition('default <=> hover', animate('300ms ease-in-out')),
    ]),
  ]
})

export class SearchPlacesComponent {
  @ViewChild('mapRef') mapComponent!: MapComponent;
  selectedCategory: string | null = null;
  currentDestination?: Destination;
  mapLocation: google.maps.LatLngLiteral = { lat: 39.72596642771257, lng: 2.914616467674367 };
  destinations: Destination[] = [];
  svgIcons: SafeHtml[] = [];
  sectionOpen = false;
  places: any[] = [];
  googlePlacesApiKey?: string;
  activeSection: string | null = null;
  selectedPlace: any = null;
  selectedPlaceImages: any[] = [];
  savedPlaceIds: string[] = [];
  markers: { lat: number, lng: number, label?: string, place?: any }[] = [];
  sections = [
    { title: 'Alojamientos', isOpen: false },
    { title: 'Comer y beber', isOpen: false },
    { title: 'Cosas que hacer', isOpen: false },
  ];

  buttonStates: { [key: string]: string } = {};

  constructor(
    private sanitizer: DomSanitizer,
    private destinationService: DestinationService,
    private searchPlacesService: SearchPlacesService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: BaseToastService,
    private apiKeyService: ApiKeyService,
    private itinerariesService: ItinerariesService,
  ) {
    let rawIcons = [
      `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="h-8 w-8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="h-8 w-8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="h-8 w-8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>`,
    ];
    this.svgIcons = rawIcons.map(icon => this.sanitizer.bypassSecurityTrustHtml(icon));
  }

  ngOnInit(): void {
    this.apiKeyService.getGooglePlacesApiKey().subscribe({
      next: (data: any) => {
        this.googlePlacesApiKey = data.googlePlacesApiKey;
      },
      error: (err: any) => {
        console.log("No ha recibido la KEY de Google Places API.")
      }
    });

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.selectedCategory = params.get('category');
      this.activeSection = params.get('category');
      this.sections.forEach(section => section.isOpen = false);
      let destinationIdParam = params.get('destinationId');
      let destinationId = destinationIdParam ? Number(destinationIdParam) : null;
      this.currentDestination = undefined; // Limpia el destino anterior
      if (destinationId) {
        this.destinationService.getDestinations().subscribe({
          next: (data: any) => {
            let destinations: Destination[] = Array.isArray(data) ? data : data.destination || [];
            this.currentDestination = destinations.find(dest => dest.destination_id === destinationId);
            if (this.currentDestination && this.currentDestination.latitude && this.currentDestination.longitude) {
              this.mapLocation = {
                lat: Number(this.currentDestination.latitude),
                lng: Number(this.currentDestination.longitude),
              };
              this.loadPlaces(this.mapLocation.lat, this.mapLocation.lng);
            } else {
              // Si no encuentra el destino, usa el valor por defecto
              this.mapLocation = { lat: 39.72596642771257, lng: 2.914616467674367 };

            }
          },
          error: () => {
            this.currentDestination = undefined;
            this.mapLocation = { lat: 39.72596642771257, lng: 2.914616467674367 };
            this.places = [];
          }
        });
      } else {
        // Si no hay destinationId, usa el valor por defecto
        this.mapLocation = { lat: 39.72596642771257, lng: 2.914616467674367 };
        this.loadPlaces(this.mapLocation.lat, this.mapLocation.lng);
      }
    });
  }

  toggleSection(index: number): void {
    this.sections.forEach((section, i) => {
      if (i === index) {
        section.isOpen = !section.isOpen;
      } else {
        section.isOpen = false;
      }
    });
  }

  loadPlaces(lat: number, lng: number): void {
    this.itinerariesService.getIdUser().subscribe({
      next: (userId: number) => {
        debugger
        let payload = {
          latitude: lat,
          longitude: lng,
          radius: 50000,
          category: this.selectedCategory,
          user_id: userId
        };
        this.searchPlacesService.googlePlacesSearchNearby(payload).subscribe({
          next: (data: any) => {
            debugger
            this.places = (data.places || [])
              .filter((p: any) => p.photos && p.photos.length > 0);
          },
          error: (err: any) => {
            this.places = [];
            this.toast.showErrorToast(500, 'No se pudieron cargar los lugares', false);
          }
        });
      },
      error: () => {
        this.toast.showErrorToast(500, 'No se pudo obtener el usuario', false);
      }
    });
  }

  getPhotoUrl(photo: any): string {
    if (photo?.name && this.googlePlacesApiKey) {
      return `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=400&key=${this.googlePlacesApiKey}`;
    }
    return 'assets/no-image.png';
  }

  getActiveSectionIndex(): number {
    return this.sections.findIndex(s => s.title === this.activeSection);
  }

  onPlaceSelect(place: any) {
    this.selectedPlace = place;
    // Guarda el array de imágenes (photos) del lugar seleccionado
    this.selectedPlaceImages = place.photos || [];
    if (place.location && place.location.latitude && place.location.longitude) {
      const marker = {
        lat: Number(place.location.latitude),
        lng: Number(place.location.longitude),
        label: place.displayName?.text || '',
        place: { ...place }
      };
      this.markers = [{
        lat: Number(place.location.latitude),
        lng: Number(place.location.longitude),
        label: place.displayName?.text || '',
        place: { ...place }
      }];
      this.mapLocation = {
        lat: Number(place.location.latitude),
        lng: Number(place.location.longitude)
      };
      setTimeout(() => {
        let index = this.markers.findIndex(m => m.lat === marker.lat && m.lng === marker.lng);
        this.mapComponent.openInfoWindow(index, marker);
      });
    }
  }

  savePlace(place: any) {
    if (this.savedPlaceIds.includes(place.id)) {
      this.toast.showErrorToast(400, 'Este lugar ya ha sido guardado', false);
      return;
    }

    let payload = {
      place_id: place.id,
      destination: this.currentDestination?.destination_id,
      name: place.displayName?.text,
      primary_type: place.primaryType,
      rating: place.rating,
      formattedAddress: place.formattedAddress,
      latitude: place.location?.latitude,
      longitude: place.location?.longitude,
      images: (place.photos || []).map((photo: any) => photo.name),
      isSave: true
    };
    let saveObservable;

    switch (this.selectedCategory) {
      case 'Alojamientos':
        saveObservable = this.searchPlacesService.saveAccommodationWithImages(payload);
        break;
      case 'Comer y beber':
        saveObservable = this.searchPlacesService.saveRestaurantWithImages(payload);
        break;
      case 'Cosas que hacer':
        saveObservable = this.searchPlacesService.saveActivityWithImages(payload);
        break;
      default:
        this.toast.showErrorToast(400, 'Tipo de lugar no soportado', false);
        return;
    }

    saveObservable.subscribe({
      next: (res) => {
        this.savedPlaceIds.push(place.id);
        place.isSave = true;
        this.toast.showSuccessToast('Lugar guardado correctamente', false);
      },
      error: (err) => {
        this.toast.showErrorToast(500, 'Error al guardar el lugar, ya ha sido guardado previamente', false);
      }
    });
  }

  setHoverState(key: string, state: string): void {
    this.buttonStates[key] = state;
  }
}