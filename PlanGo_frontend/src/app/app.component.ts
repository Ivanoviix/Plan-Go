import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, group, query } from '@angular/animations';

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
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}