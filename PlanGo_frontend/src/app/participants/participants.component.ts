import { Component, Input } from '@angular/core';
import { ItinerariesService } from '../core/services/itineraries.service';
import { ParticipantsService } from '../core/services/participants.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { BaseToastService } from '../core/services/base-toast.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-participants-form',
  standalone: true,
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.css',
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    ToastModule
  ],
})
export class ParticipantsComponent {
  @Input() destination!: number | null;
  participantName: string = '';
  errorMessage: string = '';

  constructor(
    private itinerariesService: ItinerariesService,
    private participantService: ParticipantsService,
    private toast: BaseToastService
  ) { }

  async addParticipant() {
    try {
      const participant = {
        participant_name: this.participantName,
        destination: this.destination,
      };
  
      console.log('Datos enviados al backend:', participant);
  
      this.participantService.createParticipant(participant).subscribe({
        next: () => {
          console.log('Participante creado:', this.participantName);
          this.toast.showSuccessToast('Se han añadido el participante', false);
        },
        error: (err) => {
          this.errorMessage = 'Algo falló, no se han creado los participantes.';
          console.error('Error al crear participante:', err);
        },
      });
    } catch (error) {
      console.error('Error inesperado:', error);
    }
  }

  addParticipantWithDetails(participantName: string, destinationId: number): void {
    console.log('Valores recibidos en addParticipantWithDetails:', {
      participantName,
      destinationId,
    });

    if (!destinationId) {
      console.error('El destinationId es inválido:', destinationId);
      this.errorMessage = 'No se ha seleccionado un destino válido.';
      return;
    }

    this.participantName = participantName;
    this.destination = destinationId;

    this.addParticipant();
  }
}
