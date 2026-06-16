import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FuncionariosService } from '../../../core/services/funcionarios.service';
import { Funcionario, Estamento, ESTAMENTOS } from '../../../core/models/types';

@Component({
  selector: 'app-lista-funcionarios',
  standalone: true,
  imports: [
    RouterLink, FormsModule, DatePipe,
    MatTableModule, MatButtonModule, MatIconModule,
    MatSelectModule, MatFormFieldModule, MatInputModule,
    MatCardModule, MatTooltipModule, MatSnackBarModule,
  ],
  templateUrl: './lista-funcionarios.component.html',
  styleUrl: './lista-funcionarios.component.scss',
})
export class ListaFuncionariosComponent {
  private svc = inject(FuncionariosService);
  private snack = inject(MatSnackBar);

  readonly estamentos = ESTAMENTOS;
  readonly filtroEstamento = signal<Estamento | ''>('');
  readonly filtroBusqueda = signal('');

  readonly funcionarios = this.svc.getFuncionarios();

  readonly filtrados = computed(() => {
    let list = this.funcionarios();
    const estamento = this.filtroEstamento();
    const busqueda = this.filtroBusqueda().toLowerCase();

    if (estamento) list = list.filter(f => f.estamento === estamento);
    if (busqueda) list = list.filter(f =>
      f.nombre.toLowerCase().includes(busqueda) ||
      (f.rut ?? '').toLowerCase().includes(busqueda) ||
      (f.unidad ?? '').toLowerCase().includes(busqueda) ||
      (f.dirigente_captador ?? '').toLowerCase().includes(busqueda)
    );
    return list;
  });

  readonly displayedColumns = ['nombre', 'estamento', 'captacion', 'dirigente', 'acciones'];

  eliminar(f: Funcionario): void {
    if (!confirm(`¿Eliminar a "${f.nombre}" de la lista de captados? Esta acción no se puede deshacer.`)) return;
    this.svc.delete(f.id);
    this.snack.open('Funcionario eliminado', 'OK', { duration: 3000 });
  }

  limpiarFiltros(): void {
    this.filtroEstamento.set('');
    this.filtroBusqueda.set('');
  }
}
