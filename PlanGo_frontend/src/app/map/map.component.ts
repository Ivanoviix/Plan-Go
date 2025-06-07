import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChildren, QueryList } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  standalone: true,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  imports: [CommonModule, GoogleMapsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class MapComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChildren(MapMarker) markerRefs!: QueryList<MapMarker>;
  @Input() center = { lat: 39.720007, lng: 2.910419 };
  @Input() zoom = 13; // Default zoom level
  @Input() mapOptions: google.maps.MapOptions = {
    mapId: 'DEMO_MAP_ID',
    disableDefaultUI: true,
  };
  @Input() markers: { lat: number, lng: number, label?: string, place?: any }[] = [];
  @Input() selectedPlace: any = null;
  activeMarker: any = null;
  pixelOffset = new google.maps.Size(0, -140);

  constructor() {}

  ngOnInit(): void {}

  openInfoWindow(index: number, markerData: any) {
    this.activeMarker = markerData;
    const marker = this.markerRefs.get(index);
    if (marker) {
      this.infoWindow.open(marker);
    }
  }

  getPhotoUrl(photo: any): string {
    // Igual que en SearchPlacesComponent, o pásalo como @Input
    return photo?.name ? `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=400&key=TU_API_KEY` : 'assets/no-image.png';
  }
}