import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ParticipanteService } from '../participante/participante.service';

interface Lote {
  nome: string;
  preco: number;
  quantidadeTotal: number;
  vendidos: number;
}

interface Evento {
  id: string;
  titulo: string;
  data: string;
  local: string;
  descricao: string;
  bannerUrl: string;
  lotes: Lote[];
}

interface Inscricao {
  id: string;
  eventoId: string;
  nomeAluno: string;
  matricula: string;
  curso: string;
  loteNome: string;
  dataCompra: Date;
  status: 'confirmado' | 'checkin';
}

type AbaAtiva = 'inicio' | 'criar' | 'inscrever' | 'dashboard' | 'participantes';

@Component({
  selector: 'app-calourada-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './calourada.component.css',
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <!-- Topbar / Header Navegação -->
      <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div class="flex items-center space-x-3 cursor-pointer" (click)="trocarAba('inicio')">
            <span class="text-2xl">🎉</span>
            <span class="font-extrabold text-xl tracking-wider bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
              CALOURADA UNIJORGE
            </span>
          </div>

          <nav class="flex space-x-1 sm:space-x-2">
            <button
              (click)="trocarAba('inicio')"
              [class]="abaAtiva() === 'inicio' ? 'bg-violet-600 text-white' : 'text-slate-300 hover:bg-slate-800'"
              class="px-3 py-2 rounded-lg text-sm font-medium transition">
              Eventos
            </button>
            <button
              (click)="trocarAba('criar')"
              [class]="abaAtiva() === 'criar' ? 'bg-violet-600 text-white' : 'text-slate-300 hover:bg-slate-800'"
              class="px-3 py-2 rounded-lg text-sm font-medium transition">
              + Criar Evento
            </button>
            <button
              (click)="trocarAba('dashboard')"
              [class]="abaAtiva() === 'dashboard' ? 'bg-violet-600 text-white' : 'text-slate-300 hover:bg-slate-800'"
              class="px-3 py-2 rounded-lg text-sm font-medium transition">
              Dashboard
            </button>
            <button
              (click)="trocarAba('participantes')"
              [class]="abaAtiva() === 'participantes' ? 'bg-violet-600 text-white' : 'text-slate-300 hover:bg-slate-800'"
              class="px-3 py-2 rounded-lg text-sm font-medium transition">
              Participantes
            </button>
          </nav>
        </div>
      </header>

      <!-- Conteúdo Principal -->
      <main class="max-w-7xl mx-auto px-4 py-8">

        <!-- ABA 1: LISTA / DETALHES DE EVENTOS -->
        @if (abaAtiva() === 'inicio') {
          <section>
            <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 class="text-3xl font-bold">Eventos Universitários</h1>
                <p class="text-slate-400">Garanta seu ingresso para as melhores calouradas da Unijorge</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (evento of eventos(); track evento.id) {
                <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/50 transition duration-300 flex flex-col justify-between">
                  <div>
                    <img [src]="evento.bannerUrl" [alt]="evento.titulo" class="w-full h-48 object-cover" />
                    <div class="p-5">
                      <span class="text-xs font-bold text-violet-400 uppercase tracking-widest">Unijorge</span>
                      <h2 class="text-xl font-bold mt-1 text-white">{{ evento.titulo }}</h2>
                      <p class="text-slate-400 text-sm mt-2 line-clamp-2">{{ evento.descricao }}</p>

                      <div class="mt-4 space-y-1 text-sm text-slate-300">
                        <div>📅 {{ evento.data }}</div>
                        <div>📍 {{ evento.local }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="p-5 border-t border-slate-800/80 bg-slate-900/50">
                    <button
                      (click)="selecionarParaInscricao(evento)"
                      class="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-2.5 rounded-xl transition shadow-lg shadow-violet-600/20">
                      Garantir Ingresso
                    </button>
                  </div>
                </div>
              }
            </div>
          </section>
        }

        <!-- ABA 2: FORMULÁRIO DE CRIAÇÃO -->
        @if (abaAtiva() === 'criar') {
          <section class="event-create max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
            <div class="event-create__intro">
              <span class="event-create__eyebrow">PLANEJAMENTO · UNIJORGE</span>
              <h2>Criar novo evento</h2>
              <p>Preencha os detalhes e prepare uma experiência inesquecível.</p>
            </div>

            <form (ngSubmit)="salvarEvento()" class="event-create__form space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">Título do Evento</label>
                <input
                  type="text"
                  [(ngModel)]="novoEvento.titulo"
                  name="titulo"
                  placeholder="Ex: Calourada Unijorge 2026.2"
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-violet-500"
                  required />
              </div>

              <div class="event-create__field-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-1">Data e Hora</label>
                  <input
                    type="text"
                    [(ngModel)]="novoEvento.data"
                    name="data"
                    placeholder="Ex: 20 de Nov - 22h"
                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-violet-500"
                    required />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-1">Local / Campus</label>
                  <input
                    type="text"
                    [(ngModel)]="novoEvento.local"
                    name="local"
                    placeholder="Ex: Campus Paralela / Arena"
                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-violet-500"
                    required />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">URL da Imagem / Banner</label>
                <input
                  type="url"
                  [(ngModel)]="novoEvento.bannerUrl"
                  name="bannerUrl"
                  placeholder="https://..."
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-violet-500" />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">Descrição do Evento</label>
                <textarea
                  [(ngModel)]="novoEvento.descricao"
                  name="descricao"
                  rows="3"
                  placeholder="Atrações, informações sobre bebidas, regras..."
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-violet-500"></textarea>
              </div>

              <!-- Lotes de Ingressos -->
              <div class="event-create__lots pt-4 border-t border-slate-800">
                <div class="event-create__lots-header flex justify-between items-center mb-3">
                  <div>
                    <h3 class="font-bold text-slate-200">Lotes de ingressos</h3>
                    <p>Defina o nome, o valor e a quantidade de cada lote.</p>
                  </div>
                  <button
                    type="button"
                    (click)="adicionarLote()"
                    class="event-create__add-lot text-xs bg-slate-800 hover:bg-slate-700 text-violet-400 px-3 py-1.5 rounded-lg border border-slate-700">
                    + Adicionar Lote
                  </button>
                </div>

                @for (lote of novoEvento.lotes; track $index) {
                  <div class="event-create__lot-row grid grid-cols-3 gap-2 mb-2">
                    <input type="text" [(ngModel)]="lote.nome" [name]="'loteNome' + $index" placeholder="Nome (Ex: 1º Lote)" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" />
                    <input type="number" [(ngModel)]="lote.preco" [name]="'lotePreco' + $index" placeholder="Valor R$" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" />
                    <input type="number" [(ngModel)]="lote.quantidadeTotal" [name]="'loteQtd' + $index" placeholder="Qtd Ingressos" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" />
                  </div>
                }
              </div>

              <div class="pt-4">
                <button
                  type="submit"
                  class="event-create__submit w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition">
                  Publicar evento
                </button>
              </div>
            </form>
          </section>
        }

        <!-- ABA 3: FLUXO DE INSCRIÇÃO / INGRESSO EMITIDO -->
        @if (abaAtiva() === 'inscrever' && eventoSelecionado()) {
          <section class="max-w-xl mx-auto">
            @if (!ingressoEmitido()) {
              <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                <button (click)="trocarAba('inicio')" class="text-sm text-slate-400 hover:text-white mb-4">← Voltar para lista</button>

                <h2 class="text-2xl font-bold text-white">{{ eventoSelecionado()?.titulo }}</h2>
                <p class="text-sm text-violet-400 mb-6">Preencha os dados do estudante Unijorge</p>

                <form (ngSubmit)="confirmarInscricao()" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Nome Completo</label>
                    <input type="text" [(ngModel)]="formInscricao.nome" name="nome" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-violet-500" required />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-300 mb-1">Matrícula (RA)</label>
                      <input type="text" [(ngModel)]="formInscricao.matricula" name="matricula" placeholder="202612345" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-violet-500" required />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-slate-300 mb-1">Curso</label>
                      <input type="text" [(ngModel)]="formInscricao.curso" name="curso" placeholder="Ex: Ciência da Computação" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-violet-500" required />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Selecione o Lote</label>
                    <select [(ngModel)]="formInscricao.loteIndex" name="loteIndex" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-violet-500">
                      @for (lote of eventoSelecionado()?.lotes; track $index) {
                        <option [value]="$index">{{ lote.nome }} - R$ {{ lote.preco }}</option>
                      }
                    </select>
                  </div>

                  <button type="submit" class="w-full mt-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3 rounded-xl transition">
                    Confirmar Inscrição
                  </button>
                </form>
              </div>
            } @else {
              <!-- COMPROVANTE DO INGRESSO DIGITAL -->
              <div class="bg-gradient-to-b from-slate-900 to-violet-950 border border-violet-500/40 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
                <div class="absolute -top-10 -right-10 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-2xl"></div>

                <span class="inline-block px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/40 rounded-full text-xs font-semibold mb-4">
                  ✓ Ingresso Confirmado
                </span>

                <h3 class="text-2xl font-black text-white uppercase tracking-wide">{{ eventoSelecionado()?.titulo }}</h3>
                <p class="text-slate-400 text-sm mt-1">{{ eventoSelecionado()?.data }} • {{ eventoSelecionado()?.local }}</p>

                <div class="my-6 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-left space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-slate-400">Aluno:</span> <span class="font-bold text-white">{{ ingressoEmitido()?.nomeAluno }}</span></div>
                  <div class="flex justify-between text-sm"><span class="text-slate-400">RA Unijorge:</span> <span class="font-mono text-violet-400">{{ ingressoEmitido()?.matricula }}</span></div>
                  <div class="flex justify-between text-sm"><span class="text-slate-400">Curso:</span> <span class="text-white">{{ ingressoEmitido()?.curso }}</span></div>
                  <div class="flex justify-between text-sm"><span class="text-slate-400">Ingresso:</span> <span class="text-fuchsia-400 font-bold">{{ ingressoEmitido()?.loteNome }}</span></div>
                </div>

                <!-- Simulação de QR Code -->
                <div class="bg-white p-4 rounded-2xl w-44 h-44 mx-auto flex flex-col items-center justify-center border-4 border-violet-600">
                  <div class="w-32 h-32 bg-slate-900 rounded-lg flex items-center justify-center text-xs text-slate-400 font-mono text-center p-2">
                    [QR CODE DIGITADO]<br/>{{ ingressoEmitido()?.id }}
                  </div>
                </div>
                <p class="text-xs text-slate-400 mt-3">Apresente este QR Code na portaria da Calourada</p>

                <button (click)="trocarAba('inicio')" class="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-xl transition">
                  Voltar ao início
                </button>
              </div>
            }
          </section>
        }

        <!-- ABA 4: DASHBOARD / PORTARIA -->
        @if (abaAtiva() === 'dashboard') {
          <section class="space-y-6">
            <h2 class="text-2xl font-bold">Painel do Organizador</h2>

            <!-- Cards com Métricas -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span class="text-slate-400 text-sm">Total de Inscrições</span>
                <div class="text-3xl font-black text-violet-400 mt-1">{{ inscricoes().length }}</div>
              </div>
              <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span class="text-slate-400 text-sm">Eventos Ativos</span>
                <div class="text-3xl font-black text-fuchsia-400 mt-1">{{ eventos().length }}</div>
              </div>
              <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span class="text-slate-400 text-sm">Check-ins na Portaria</span>
                <div class="text-3xl font-black text-green-400 mt-1">{{ totalCheckins() }}</div>
              </div>
            </div>

            <!-- Tabela de Alunos Inscritos -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div class="p-4 border-b border-slate-800 font-bold text-slate-200">
                Lista de Alunos Registrados
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-slate-300">
                  <thead class="bg-slate-950 text-slate-400 uppercase text-xs">
                    <tr>
                      <th class="p-4">Aluno</th>
                      <th class="p-4">Matrícula</th>
                      <th class="p-4">Curso</th>
                      <th class="p-4">Lote</th>
                      <th class="p-4">Status</th>
                      <th class="p-4 text-right">Ação Portaria</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800">
                    @for (item of inscricoes(); track item.id) {
                      <tr class="hover:bg-slate-800/40">
                        <td class="p-4 font-medium text-white">{{ item.nomeAluno }}</td>
                        <td class="p-4 font-mono text-slate-400">{{ item.matricula }}</td>
                        <td class="p-4">{{ item.curso }}</td>
                        <td class="p-4 text-violet-400 font-medium">{{ item.loteNome }}</td>
                        <td class="p-4">
                          <span [class]="item.status === 'checkin' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'"
                                class="px-2.5 py-1 rounded-full text-xs font-semibold border">
                            {{ item.status === 'checkin' ? 'Entrada Confirmada' : 'Pendente' }}
                          </span>
                        </td>
                        <td class="p-4 text-right">
                          @if (item.status === 'confirmado') {
                            <button
                              (click)="fazerCheckin(item.id)"
                              class="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs transition">
                              Validar QR Code
                            </button>
                          } @else {
                            <span class="text-xs text-slate-500">Já Validado</span>
                          }
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="6" class="p-8 text-center text-slate-500">Nenhuma inscrição realizada até o momento.</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        }

        @if (abaAtiva() === 'participantes') {
          <section class="participants-list">
            <div class="participants-list__heading">
              <div>
                <h1>Participantes cadastrados</h1>
                <p>Lista de pessoas que preencheram o cadastro.</p>
              </div>
              <span class="participants-list__count">{{ participantes().length }} cadastrados</span>
            </div>

            <div class="participants-list__table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Data de nascimento</th>
                    <th>CPF</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
                  </tr>
                </thead>
                <tbody>
                  @for (participante of participantes(); track $index) {
                    <tr>
                      <td class="participants-list__name">{{ participante.nome }}</td>
                      <td>{{ participante.dataNascimento | date: 'dd/MM/yyyy' }}</td>
                      <td>{{ participante.cpf }}</td>
                      <td>{{ participante.email }}</td>
                      <td>{{ participante.telefone }}</td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="5" class="participants-list__empty">
                        Nenhum participante cadastrado ainda.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>
        }

      </main>
    </div>
  `
})
export class CalouradaManagerComponent {
  private readonly participanteService = inject(ParticipanteService);
  private readonly route = inject(ActivatedRoute);

  // Estado com Signals
  abaAtiva = signal<AbaAtiva>(
    this.route.snapshot.queryParamMap.get('aba') === 'participantes' ? 'participantes' : 'inicio'
  );
  participantes = this.participanteService.participantes;

  eventos = signal<Evento[]>([
    {
      id: 'calourada-uj-2026',
      titulo: 'Grande Calourada Unijorge 2026',
      data: '24 de Outubro • 21h',
      local: 'Campus Paralela - Salvador/BA',
      descricao: 'A maior festa universitária de boas-vindas do ano! Open cooler, atrações ao vivo e integração de todos os cursos.',
      bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
      lotes: [
        { nome: '1º Lote Promocional', preco: 25, quantidadeTotal: 100, vendidos: 45 },
        { nome: '2º Lote Universitário', preco: 35, quantidadeTotal: 150, vendidos: 10 }
      ]
    }
  ]);

  inscricoes = signal<Inscricao[]>([
    {
      id: 'INS-8912',
      eventoId: 'calourada-uj-2026',
      nomeAluno: 'Lucas Andrade',
      matricula: '202610992',
      curso: 'Engenharia de Software',
      loteNome: '1º Lote Promocional',
      dataCompra: new Date(),
      status: 'confirmado'
    }
  ]);

  eventoSelecionado = signal<Evento | null>(null);
  ingressoEmitido = signal<Inscricao | null>(null);

  // Computado
  totalCheckins = computed(() => this.inscricoes().filter(i => i.status === 'checkin').length);

  // Formulário de novo evento
  novoEvento: Omit<Evento, 'id'> = {
    titulo: '',
    data: '',
    local: '',
    descricao: '',
    bannerUrl: '',
    lotes: [{ nome: '1º Lote', preco: 20, quantidadeTotal: 100, vendidos: 0 }]
  };

  // Formulário de Inscrição
  formInscricao = {
    nome: '',
    matricula: '',
    curso: '',
    loteIndex: 0
  };

  trocarAba(aba: AbaAtiva) {
    this.abaAtiva.set(aba);
  }

  adicionarLote() {
    this.novoEvento.lotes.push({
      nome: `${this.novoEvento.lotes.length + 1}º Lote`,
      preco: 0,
      quantidadeTotal: 50,
      vendidos: 0
    });
  }

  salvarEvento() {
    if (!this.novoEvento.titulo || !this.novoEvento.data) return;

    const criado: Evento = {
      ...this.novoEvento,
      id: 'evt-' + Date.now(),
      bannerUrl: this.novoEvento.bannerUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=60'
    };

    this.eventos.update(evs => [criado, ...evs]);
    this.trocarAba('inicio');

    // Reset formulário
    this.novoEvento = {
      titulo: '',
      data: '',
      local: '',
      descricao: '',
      bannerUrl: '',
      lotes: [{ nome: '1º Lote', preco: 20, quantidadeTotal: 100, vendidos: 0 }]
    };
  }

  selecionarParaInscricao(evento: Evento) {
    this.eventoSelecionado.set(evento);
    this.ingressoEmitido.set(null);
    this.trocarAba('inscrever');
  }

  confirmarInscricao() {
    const evento = this.eventoSelecionado();
    if (!evento) return;

    const lote = evento.lotes[this.formInscricao.loteIndex] || evento.lotes[0];

    const novaInscricao: Inscricao = {
      id: 'UJ-' + Math.floor(100000 + Math.random() * 900000),
      eventoId: evento.id,
      nomeAluno: this.formInscricao.nome,
      matricula: this.formInscricao.matricula,
      curso: this.formInscricao.curso,
      loteNome: lote.nome,
      dataCompra: new Date(),
      status: 'confirmado'
    };

    this.inscricoes.update(list => [novaInscricao, ...list]);
    this.ingressoEmitido.set(novaInscricao);

    // Reset formulário
    this.formInscricao = { nome: '', matricula: '', curso: '', loteIndex: 0 };
  }

  fazerCheckin(inscricaoId: string) {
    this.inscricoes.update(list =>
      list.map(i => i.id === inscricaoId ? { ...i, status: 'checkin' as const } : i)
    );
  }
}
