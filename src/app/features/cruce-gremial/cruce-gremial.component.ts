import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CruceGremialService } from '../../core/services/cruce-gremial.service';
import { CruceGremialRow } from '../../core/models/types';

@Component({
  selector: 'app-cruce-gremial',
  standalone: true,
  imports: [
    FormsModule, DatePipe, CurrencyPipe,
    MatCardModule, MatButtonModule, MatIconModule, MatTableModule,
    MatSelectModule, MatFormFieldModule, MatInputModule, MatChipsModule,
    MatSnackBarModule,
  ],
  templateUrl: './cruce-gremial.component.html',
  styleUrl: './cruce-gremial.component.scss',
})
export class CruceGremialComponent {
  private svc = inject(CruceGremialService);
  private snack = inject(MatSnackBar);

  readonly state = this.svc.getState();
  readonly filtroEstado = signal<string>('');
  readonly filtroBusqueda = signal('');
  readonly errorImport = signal('');

  readonly estadosDisponibles = computed(() => {
    const estados = new Set(this.state().filas.map(f => f.estado_cruce ?? ''));
    return Array.from(estados).filter(e => e);
  });

  readonly filtrados = computed(() => {
    let list = this.state().filas;
    const estado = this.filtroEstado();
    const busqueda = this.filtroBusqueda().toLowerCase();

    if (estado) list = list.filter(f => (f.estado_cruce ?? '') === estado);
    if (busqueda) list = list.filter(f =>
      (f.rut ?? '').toLowerCase().includes(busqueda) ||
      (f.nombre_unesie ?? '').toLowerCase().includes(busqueda) ||
      (f.nombre_transparencia ?? '').toLowerCase().includes(busqueda) ||
      (f.correo_electronico ?? '').toLowerCase().includes(busqueda)
    );
    return list;
  });

  readonly displayedColumns = ['rut', 'nombre_unesie', 'estamento', 'cargo', 'cuota_gremial_estimada', 'estado_cruce'];

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.errorImport.set('');
    this.svc.importFromFile(file)
      .then(result => {
        this.snack.open(`Importado: ${result.filas} socios`, 'OK', { duration: 4000 });
      })
      .catch(error => {
        const msg = error instanceof Error ? error.message : 'Error desconocido';
        this.errorImport.set(msg);
        this.snack.open(msg, 'OK', { duration: 5000 });
      })
      .finally(() => input.value = '');
  }

  limpiar(): void {
    if (!confirm('¿Eliminar todos los datos del cruce gremial? Esta acción no se puede deshacer.')) return;
    this.svc.limpiar();
    this.snack.open('Datos eliminados', 'OK', { duration: 2000 });
  }

  limpiarFiltros(): void {
    this.filtroEstado.set('');
    this.filtroBusqueda.set('');
  }

  estadoColor(estado: string | undefined): string {
    if (!estado) return '#9e9e9e';
    if (estado.toLowerCase() === 'exacto') return '#4caf50';
    if (estado.toLowerCase() === 'fuzzy') return '#ff9800';
    return '#f44336';
  }
}
