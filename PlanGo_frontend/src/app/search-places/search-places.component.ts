import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { HeaderComponent } from "../header/header.component";
import { MapComponent } from "../map/map.component";
import { ParticipantsComponent } from "../participants/participants.component";
import { FormsModule } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Destination } from "../destinations/interfaces/destinations.interface";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { DestinationService } from "../core/services/destinations.service";
import { BaseToastService } from '../core/services/base-toast.service';

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
  ],
})

export class SearchPlacesComponent {
  categoriaSeleccionada: string | null = null;
  currentDestination?: Destination; 
  mapLocation: google.maps.LatLngLiteral = { lat: 39.72596642771257, lng: 2.914616467674367 }; // Default map location
  destinations: Destination[] = [];
  svgIcons: SafeHtml[] = []; // Array for SVG icons
  sectionOpen = false;

  sections = [
    { title: 'Alojamientos', isOpen: false },
    { title: 'Comer y beber', isOpen: false },
    { title: 'Cosas que hacer', isOpen: false },
  ];
  constructor(  
              private sanitizer: DomSanitizer,     
              private destinationService: DestinationService,
              private route: ActivatedRoute,
              private router: Router,
              private toast: BaseToastService,
            ) {
    const rawIcons = [
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
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.categoriaSeleccionada = params.get('category');
    });
  }

  toggleSection(index: number): void {
    this.sections[index].isOpen = !this.sections[index].isOpen;
    this.sectionOpen = !this.sectionOpen;

  }
}