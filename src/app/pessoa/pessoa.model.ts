export type Vinculo = 'aluno' | 'professor' | 'servidor';

export interface Pessoa {
  id: number;
  nome: string;
  curso: string;
  email: string;
  ativo: boolean;
  telefone?: string;
  vinculo: Vinculo;
}