import { Component } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-search-locations',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MapComponent],
  templateUrl: './search-locations.component.html',
  styleUrl: './search-locations.component.css'
})
export class SearchLocationsComponent {

}
