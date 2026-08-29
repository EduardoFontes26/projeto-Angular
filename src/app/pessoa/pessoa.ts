import { Component } from '@angular/core';
import { Pessoa } from './pessoa.model';

@Component({
  selector: 'app-pessoa',
  standalone: true,
  imports: [],
  templateUrl: './pessoa.html',
  styleUrl: './pessoa.css'
})
export class PessoaComponent {
  pessoas: Pessoa[] = [
    {
      id: 1,
      nome: 'Eduardo Fontes',
      curso: 'Ciência da Computação',
      email: 'eduardo@email.com',
      ativo: true,
      telefone: '71999998888',
      vinculo: 'aluno'
    },
    {
      id: 2,
      nome: 'Maria Silva',
      curso: 'Sistemas de Informação',
      email: 'maria@email.com',
      ativo: true,
      vinculo: 'aluno'
    },
    {
      id: 3,
      nome: 'Carlos Souza',
      curso: 'Engenharia de Software',
      email: 'carlos@email.com',
      ativo: false,
      telefone: '71988887777',
      vinculo: 'professor'
    },
    {
      id: 4,
      nome: 'Ana Oliveira',
      curso: 'Análise de Sistemas',
      email: 'ana@email.com',
      ativo: true,
      vinculo: 'servidor'
    }
  ];
}