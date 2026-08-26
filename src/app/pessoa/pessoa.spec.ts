import { Component } from '@angular/core';

@Component({
  selector: 'app-pessoa',
  standalone: true,
  imports: [],
  templateUrl: './pessoa.component.html',
  styleUrl: './pessoa.component.css'
})
export class PessoaComponent {
  nome: string = 'Eduardo';
  curso: string = 'Análise e desenvolvimento de sistemas';
  email: string = 'dudufontes01.ef@gmail.com';
}