import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { map, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../globals';
import { BaseHttpService } from './base-http.service';
import { MessageService } from '../messageService';


@Injectable({
  providedIn: 'root',
})
export class DestinationService extends BaseHttpService {
  private csrfToken: string = '';

  map(arg0: (code: any) => any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    public override httpClient: HttpClient, 
    @Inject(PLATFORM_ID) private platformId: Object,
    public override toast: MessageService 
  ) {
    super(httpClient, toast); 
  }
    
  getDestinations(): Observable<any> {
    const headers = this.createHeaders();
    return this.httpClient.get(`${globals.apiBaseUrl}/itineraries/destination/`, { headers });
  }

  getDestinationsByItinerary(itineraryId: number): Observable<any> {
    const headers = this.createHeaders();
    return this.httpClient.get(`${globals.apiBaseUrl}/itineraries/destination/${itineraryId}/`, { headers });
  }

  getDestinationSummary(destinationId: number): Observable<any> {
    const headers = this.createHeaders(); // Si necesitas autenticación
    return this.httpClient.get(`${globals.apiBaseUrl}/itineraries/destination/${destinationId}/summary/`, { headers });
  }

  getCountriesByDestination(destinationId: number): Observable<any> {
    const headers = this.createHeaders();
    return this.httpClient.get(`${globals.apiBaseUrl}/itineraries/destination/${destinationId}`, { headers })
  }

  getCitiesFromGoogle(input: string, countryCode: string): Observable<any> {
    const headers = this.createHeaders();
    return this.httpClient.get(`${globals.apiBaseUrl}/itineraries/geocodenames/?input=${input}&country=${countryCode}`, { headers });
  }

  getCountriesByItinerary(itineraryId: number): Observable<any> {
    const headers = this.createHeaders();
    return this.httpClient.get(`${globals.apiBaseUrl}/itineraries/itinerary/${itineraryId}/countries/`, { headers })
  }

  createDestination(destination: any): Observable<any> {
    const headers = this.createHeaders();
    return this.httpClient.post(`${globals.apiBaseUrl}/itineraries/destination/create/`, destination, { headers, withCredentials: true });
  }

  updateDateDestination(destinationId: any, data: any = {}): Observable<any> {
  const headers = this.createHeaders();
  return this.httpClient.patch(
    `${globals.apiBaseUrl}/itineraries/destination/update/${destinationId}/`,
    data,
    { headers, withCredentials: true }
  );
}

  private createHeaders(): HttpHeaders {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem(globals.keys.accessToken) || '';
    }
  
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'X-CSRFToken': this.csrfToken,
      'Content-Type': 'application/json',
    });
  }

  googlePlacesSearchNearby(payload: { latitude: number, longitude: number, radius?: number }) {
    const headers = this.createHeaders();
      return this.httpClient.post(`${globals.apiBaseUrl}/places/google_places_search_nearby/`,payload, { headers }
    );
  }

  getCsrfTokenFromServer(): Observable<string> {
    if (!isPlatformBrowser(this.platformId)) return throwError(() => new Error('localStorage is not available in this environment'));

    const token = localStorage.getItem(globals.keys.accessToken) || '';
    if (!token) {
      return throwError(() => new Error('Token de usuario no disponible'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient.get<{ csrftoken: string }>(`${globals.apiBaseUrl}/itineraries/csrf-token/`, {
      headers,
      withCredentials: true, 
    }).pipe(
      map((response) => response.csrftoken)
    );
  }

  setCsrfToken(token: string): void {
    this.csrfToken = token.replace(/^"|"$/g, '');
  }
}