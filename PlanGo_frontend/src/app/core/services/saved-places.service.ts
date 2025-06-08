import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { map, Observable, throwError } from 'rxjs';
import { globals } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class SavedPlacesService {
    private csrfToken: string = '';

    constructor(
        private httpClient: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

  getSavedPlacesByCategory(userId: number): Observable<any> {
    let token = '';
    let headers = this.createHeaders();
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem(globals.keys.accessToken) || '';
    }
    return this.httpClient.get(`${globals.apiBaseUrl}/places/get_saved_places_by_category/${userId}/`, { headers });
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
        console.log('CSRF token recibido:', token);
        this.csrfToken = token.replace(/^"|"$/g, '');
    }
}