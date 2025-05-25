import { Component, Input } from '@angular/core';
import { ItinerariesService } from '../core/services/itineraries.service';
import { ParticipantsService } from '../core/services/participants.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-participants-form',
  standalone: true,
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.css',
  imports: [CommonModule, FormsModule, HeaderComponent], 
})
export class ParticipantsComponent {
    @Input() destination!: number;
    participantName: string = '';
    errorMessage: string = '';

  constructor(private itinerariesService: ItinerariesService, private participantService: ParticipantsService ) {}

  async addParticipant() {
    try {
      let userId = await this.itinerariesService.getIdUser()
      let participant = {
        participant_name: this.participantName,
        destination: this.destination,
      };      
      this.participantService.createParticipant(participant).subscribe({
        next: () => {
            console.log("HA SIDO CREADO!", this.participantName)
        },
        error: (err) => {
          this.errorMessage = 'Algo falló, no se han creado los participantes.';
          console.error(err);
        }
      });
    } catch (error) {
      console.error(error)
    }
  }
}
