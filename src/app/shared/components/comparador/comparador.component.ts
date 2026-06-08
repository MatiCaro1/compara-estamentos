import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { EscalaService } from '../../../core/services/escala.service';
import { Estamento, ESTAMENTOS } from '../../../core/models/types';

@Component({
  selector: 'app-comparador',
  standalone: true,
  imports: [
    FormsModule, CurrencyPipe,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatDividerModule,
  ],
  templateUrl: './comparador.component.html',
  styleUrl: './comparador.component.scss',
})
export class ComparadorComponent {
  private escala = inject(EscalaService);

  readonly estamentos = ESTAMENTOS;

  readonly estamentoA = signal<Estamento | null>(null);
  readonly gradoA = signal<number | null>(null);
  readonly estamentoB = signal<Estamento | null>(null);
  readonly gradoB = signal<number | null>(null);

  readonly gradosA = signal<number[]>([]);
  readonly gradosB = signal<number[]>([]);

  readonly remA = signal<number | null>(null);
  readonly remB = signal<number | null>(null);
  readonly diff = signal<{ diff_mensual: number; diff_anual: number; pct: number } | null>(null);

  onEstamentoAChange(e: Estamento): void {
    this.estamentoA.set(e);
    this.gradosA.set(this.escala.getGradosPorEstamento(e));
    this.gradoA.set(null);
    this.remA.set(null);
    this.diff.set(null);
  }

  onEstamentoBChange(e: Estamento): void {
    this.estamentoB.set(e);
    this.gradosB.set(this.escala.getGradosPorEstamento(e));
    this.gradoB.set(null);
    this.remB.set(null);
    this.diff.set(null);
  }

  onGradoAChange(g: number): void {
    this.gradoA.set(g);
    const ea = this.estamentoA();
    if (ea) {
      const row = this.escala.lookup(ea, g);
      this.remA.set(row?.rem_bruta ?? null);
    }
    this.calcularDiff();
  }

  onGradoBChange(g: number): void {
    this.gradoB.set(g);
    const eb = this.estamentoB();
    if (eb) {
      const row = this.escala.lookup(eb, g);
      this.remB.set(row?.rem_bruta ?? null);
    }
    this.calcularDiff();
  }

  private calcularDiff(): void {
    const ea = this.estamentoA(); const ga = this.gradoA();
    const eb = this.estamentoB(); const gb = this.gradoB();
    if (!ea || !ga || !eb || !gb) { this.diff.set(null); return; }
    const result = this.escala.calcularDiff(
      { estamento: ea, grado: ga },
      { estamento: eb, grado: gb }
    );
    if (result) {
      this.diff.set({ diff_mensual: result.diff_mensual, diff_anual: result.diff_anual, pct: result.pct_incremento });
    }
  }

  limpiar(): void {
    this.estamentoA.set(null); this.gradoA.set(null); this.remA.set(null);
    this.estamentoB.set(null); this.gradoB.set(null); this.remB.set(null);
    this.gradosA.set([]); this.gradosB.set([]);
    this.diff.set(null);
  }
}
