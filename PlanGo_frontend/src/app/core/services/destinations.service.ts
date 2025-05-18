import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
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


  private createHeaders(): HttpHeaders {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem(globals.keys.accessToken) || '';
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}