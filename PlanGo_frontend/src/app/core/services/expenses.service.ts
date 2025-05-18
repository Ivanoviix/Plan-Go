import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import {globals} from '../globals';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private apiUrl = `${globals.apiBaseUrl}/expenses/expense/user/`;

  constructor(
    
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  private createHeaders(): HttpHeaders {
    
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem(globals.keys.accessToken) || '';
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getExpensesByLoggedUser(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(this.apiUrl, { headers });
  }
}