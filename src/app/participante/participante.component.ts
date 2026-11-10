import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Participante } from './participante.model';
import { ParticipanteService } from './participante.service';

@Component({
  selector: 'app-participante',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './participante.component.html',
  styleUrl: './participante.component.css'
})
export class ParticipanteComponent {
  constructor(private readonly participanteService: ParticipanteService) {}

  participante: Participante = {
    nome: '',
    dataNascimento: '',
    cpf: '',
    email: '',
    telefone: ''
  };

  participanteCadastrado: Participante | null = null;

  cadastrarParticipante() {
    this.participanteCadastrado = { ...this.participante };
    this.participanteService.adicionar(this.participanteCadastrado);
  }
}
