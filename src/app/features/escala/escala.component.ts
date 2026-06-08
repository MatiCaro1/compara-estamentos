import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { EscalaService } from '../../core/services/escala.service';
import { Estamento, ESTAMENTOS } from '../../core/models/types';

@Component({
  selector: 'app-escala',
  standalone: true,
  imports: [
    CurrencyPipe, FormsModule,
    MatTableModule, MatCardModule, MatFormFieldModule,
    MatSelectModule, MatIconModule, MatButtonModule, MatChipsModule,
  ],
  templateUrl: './escala.component.html',
  styleUrl: './escala.component.scss',
})
export class EscalaComponent {
  private escalaService = inject(EscalaService);

  readonly estamentos = ESTAMENTOS;
  readonly filtroEstamento = signal<Estamento | ''>('');

  readonly escala = computed(() => {
    const all = this.escalaService.getEscala();
    const filtro = this.filtroEstamento();
    return filtro ? all.filter(r => r.estamento === filtro) : all;
  });

  readonly displayedColumns = [
    'estamento', 'grado', 'sueldo_base', 'incremento_dl3501',
    'asig_fiscalizacion', 'bon_salud', 'bon_previsional',
    'asig_unica', 'ley18091_art17', 'asig_desempenio_fija',
    'asig_desempenio_variable', 'rem_bruta'
  ];

  readonly displayedColumnsShort = ['estamento', 'grado', 'sueldo_base', 'rem_bruta'];
}
