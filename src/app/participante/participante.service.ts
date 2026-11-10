import { Injectable, signal } from '@angular/core';
import { Participante } from './participante.model';

@Injectable({ providedIn: 'root' })
export class ParticipanteService {
  private readonly lista = signal<Participante[]>([]);
  readonly participantes = this.lista.asReadonly();

  adicionar(participante: Participante) {
    this.lista.update(participantes => [...participantes, { ...participante }]);
  }
}
