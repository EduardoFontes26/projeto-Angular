import { Routes } from '@angular/router';
import { CalouradaManagerComponent } from './calourada/calourada.component';
import { ParticipanteComponent } from './participante/participante.component';

export const routes: Routes = [
  { path: '', redirectTo: 'calourada', pathMatch: 'full' },
  { path: 'calourada', component: CalouradaManagerComponent },
  { path: 'participante', component: ParticipanteComponent }
];