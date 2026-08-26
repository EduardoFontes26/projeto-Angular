import { Component } from '@angular/core';

@Component({
  selector: 'app-pessoa',
  standalone: true,
  imports: [],
  templateUrl: './pessoa.html',
  styleUrl: './pessoa.css'
})
export class Pessoa {
  nome: string = 'Eduardo';
  curso: string = 'Análise e desenvolvimento de sistemas';
  email: string = 'dudufontes01.ef@gmail.com';
}