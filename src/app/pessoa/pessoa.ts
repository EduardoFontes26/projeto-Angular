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
  curso: string = 'Ciência da Computação';
  email: string = 'dudufontes01.ef@gmail.com';
}