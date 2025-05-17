import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../globals';
import { BaseHttpService } from './base-http.service';
import { MessageService } from '../messageService';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class ItinerariesService extends BaseHttpService {
  constructor(
    public override httpClient: HttpClient, 
    @Inject(PLATFORM_ID) private platformId: Object,
    public override toast: MessageService 
  ) {
    super(httpClient, toast); 
  }

  async getIdUser(): Promise<number> {
    if (!isPlatformBrowser(this.platformId)) throw new Error('localStorage no está disponible en este entorno');
    const token = localStorage.getItem(globals.keys.accessToken) || '';
    if (!token) throw new Error('No token found in localStorage');
  
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) throw new Error('Invalid token format');
  
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const uid = decodedPayload?.user_id;
    if (!uid) throw new Error('UID not found in token');
  
    const response: any = await this.httpClient.post(`${globals.apiBaseUrl}/users/user/get_id`, { uid }).toPromise();
    return response.id;
  }

  async getItineraries(): Promise<Observable<any>> {
    debugger
    const userId = await this.getIdUser();
    console.log("aaaaaa", userId);
    const headers = this.createHeaders();
    return this.httpClient.get(`${globals.apiBaseUrl}/itineraries/itinerary/${userId}`, { headers });
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