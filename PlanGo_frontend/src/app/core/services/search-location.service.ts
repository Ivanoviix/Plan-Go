import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, switchMap, throwError } from 'rxjs';
import { globals } from '../globals';
import { MessageService } from '../messageService';

@Injectable({
    providedIn: 'root'
})
export class SearchLocationService {
    activePhotoIndex: number = 0;
    selectedPlaceImages: any[] = [];
    googlePlacesApiKey?: string;
    activeMarker: any = null;

    private csrfToken: string = '';

    constructor(
        public httpClient: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object,
        public toast: MessageService
    ) {
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

    getAllCategories(destinationId: any): Observable<any> {
        let headers = this.createHeaders();
        return this.httpClient.post(
            `${globals.apiBaseUrl}/places/get_categories/`, { destination_id: destinationId }, { headers, withCredentials: true }
        );
    }

}