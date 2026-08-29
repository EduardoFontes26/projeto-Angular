import { Routes } from '@angular/router';
import { Home } from './home/home';
import { PessoaComponent } from './pessoa/pessoa';
import { NaoEncontrada } from './nao-encontrada/nao-encontrada';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'pessoa', component: PessoaComponent },
  { path: '**', component: NaoEncontrada }
];