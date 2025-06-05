import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [
    trigger('hoverAnimation', [
      state('default', style({ transform: 'scale(1)' })),
      state('hover', style({ transform: 'scale(1.2)' })),
      transition('default <=> hover', animate('300ms ease-in-out')),
    ]),
    trigger('expandHeader', [
      state('collapsed', style({ width: '4rem' })), 
      state('expanded', style({ width: '16rem' })), 
      transition('collapsed <=> expanded', animate('300ms cubic-bezier(0.4,0,0.2,1)')),
    ]),
  ],
})
export class HeaderComponent {
  buttonStates: { [key: string]: string } = {
    itineraries: 'default',
    expenses: 'default',
    savedPlaces: 'default',
    profile: 'default',
  };
  headerState: 'collapsed' | 'expanded' = 'collapsed';


  constructor( 
    private router: Router,
  ){}

  toggleHeaderWidth() {
    this.headerState = this.headerState === 'collapsed' ? 'expanded' : 'collapsed';
  }

  setHoverState(button: string, state: string): void {
    this.buttonStates[button] = state;
  }

  goToExpense(){
    this.router.navigate(["/expenses"]);
  }

  goToItineraries() {
    this.router.navigate(["/itineraries"])
  }

  /* goToSavedPlaces() {
    
  }

  goToprofile() {

  } */

}
