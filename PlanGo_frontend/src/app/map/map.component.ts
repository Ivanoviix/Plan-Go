import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GoogleMapsModule, GoogleMap } from '@angular/google-maps';

@Component({
  standalone: true,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  imports: [GoogleMapsModule],
})

export class MapComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}