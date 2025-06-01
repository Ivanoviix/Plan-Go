import { Component, OnInit } from '@angular/core';
import { map, throwError } from 'rxjs';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, group, query } from '@angular/animations';
import { ItinerariesService } from './core/services/itineraries.service';
import { DestinationService } from './core/services/destinations.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule],
  animations: [
    trigger('routeAnimations', [
      // Animación de login a register (invertida)
      transition('LoginPage => RegisterPage', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
        group([
          query(':leave', [
            animate('500ms ease-in-out', style({ transform: 'translateX(50%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            style({ transform: 'translateX(-50%)', opacity: 0 }),
            animate('500ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
          ], { optional: true })
        ])
      ]),
      // Animación de register a login (invertida)
      transition('RegisterPage => LoginPage', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
        group([
          query(':leave', [
            animate('500ms ease-in-out', style({ transform: 'translateX(-50%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            style({ transform: 'translateX(50%)', opacity: 0 }),
            animate('500ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
          ], { optional: true })
        ])
      ]),
      // Animación genérica para otras rutas
      transition('* <=> *', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
        group([
          query(':leave', [
            animate('500ms ease-in-out', style({ transform: 'translateX(50%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            style({ transform: 'translateX(-50%)', opacity: 0 }),
            animate('500ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})

export class AppComponent implements OnInit {
  constructor(
    private itinerariesService: ItinerariesService,
    private destinationService: DestinationService
  ) {}

  ngOnInit(): void {
    this.itinerariesService.getCsrfTokenFromServer().subscribe({
      next: (csrfToken) => {
        console.log('CSRF Token obtenido:', csrfToken);
        this.itinerariesService.setCsrfToken(csrfToken);
      },
      error: (err) => {
        console.error('Error al obtener el token CSRF:', err);
      },
    });

    this.destinationService.getCsrfTokenFromServer().subscribe({
      next: (csrfToken) => {
        this.destinationService.setCsrfToken(csrfToken);
      },
      error: (err) => {
        console.error('Error al obtener el token CSRF:', err);
      },
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
