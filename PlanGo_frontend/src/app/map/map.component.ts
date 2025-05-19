import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  standalone: true,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  imports: [GoogleMapsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Allow custom elements like <gmp-map>
})
export class MapComponent implements OnInit {
  @Input() center = { lat: 39.720007, lng: 2.910419 }; // Default center
  @Input() zoom = 13; // Default zoom level
  @Input() mapOptions: google.maps.MapOptions = {
    mapId: 'DEMO_MAP_ID',
    disableDefaultUI: true,
  };

  constructor() {}

  ngOnInit(): void {}
}