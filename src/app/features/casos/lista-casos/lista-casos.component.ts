import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StorageService } from '../../../core/services/storage.service';
import { Caso, EstadoCaso, Estamento, ESTADOS_CASO, ESTAMENTOS } from '../../../core/models/types';

@Component({
  selector: 'app-lista-casos',
  standalone: true,
  imports: [
    RouterLink, FormsModule, DatePipe, DecimalPipe,
    MatTableModule, MatButtonModule, MatIconModule,
    MatSelectModule, MatFormFieldModule, MatInputModule,
    MatCardModule, MatChipsModule, MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './lista-casos.component.html',
  styleUrl: './lista-casos.component.scss',
})
export class ListaCasosComponent {
  private storage = inject(StorageService);
  private snack = inject(MatSnackBar);

  readonly estadosMeta = ESTADOS_CASO;
  readonly estamentos = ESTAMENTOS;

  readonly filtroEstado = signal<EstadoCaso | ''>('');
  readonly filtroEstamento = signal<Estamento | ''>('');
  readonly filtroBusqueda = signal('');

  readonly casos = this.storage.getCasos();

  readonly casosFiltrados = computed(() => {
    let list = this.casos();
    const estado = this.filtroEstado();
    const estamento = this.filtroEstamento();
    const busqueda = this.filtroBusqueda().toLowerCase();

    if (estado) list = list.filter(c => c.estado === estado);
    if (estamento) list = list.filter(c => c.estamento_actual === estamento || c.estamento_solicitado === estamento);
    if (busqueda) list = list.filter(c =>
      c.nombre.toLowerCase().includes(busqueda) ||
      (c.rut ?? '').toLowerCase().includes(busqueda) ||
      (c.unidad ?? '').toLowerCase().includes(busqueda)
    );
    return list;
  });

  readonly displayedColumns = ['nombre', 'posicion_actual', 'posicion_solicitada', 'diff_mensual', 'estado', 'fecha_ingreso', 'acciones'];

  estadoLabel(e: EstadoCaso): string {
    return ESTADOS_CASO.find(s => s.value === e)?.label ?? e;
  }

  estadoColor(e: EstadoCaso): string {
    return ESTADOS_CASO.find(s => s.value === e)?.color ?? '#9e9e9e';
  }

  eliminar(caso: Caso): void {
    if (!confirm(`¿Eliminar el caso de "${caso.nombre}"? Esta acción no se puede deshacer.`)) return;
    this.storage.delete(caso.id);
    this.snack.open('Caso eliminado', 'OK', { duration: 3000 });
  }

  limpiarFiltros(): void {
    this.filtroEstado.set('');
    this.filtroEstamento.set('');
    this.filtroBusqueda.set('');
  }
}
