import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe, DecimalPipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { StorageService } from '../../core/services/storage.service';
import { ESTADOS_CASO, EstadoCaso } from '../../core/models/types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, SlicePipe, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatChipsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private storage = inject(StorageService);
  readonly casos = this.storage.getCasos();
  readonly estadosMeta = ESTADOS_CASO;

  readonly totalCasos = computed(() => this.casos().length);

  readonly costoMensual = computed(() =>
    this.casos().filter(c => c.diff_mensual > 0).reduce((s, c) => s + c.diff_mensual, 0)
  );

  readonly costoAnual = computed(() => this.costoMensual() * 12);

  readonly favorables = computed(() =>
    this.casos().filter(c => c.estado === 'resuelto_favorable').length
  );

  readonly porEstado = computed(() =>
    ESTADOS_CASO.map(e => ({
      ...e,
      count: this.casos().filter(c => c.estado === e.value).length,
    }))
  );

  readonly topCasos = computed(() =>
    [...this.casos()]
      .sort((a, b) => b.diff_mensual - a.diff_mensual)
      .slice(0, 8)
  );

  readonly maxDiff = computed(() =>
    Math.max(...this.casos().map(c => c.diff_mensual), 1)
  );

  barWidth(diff: number): string {
    return Math.max(2, (diff / this.maxDiff()) * 100).toFixed(1) + '%';
  }

  estadoLabel(estado: EstadoCaso): string {
    return ESTADOS_CASO.find(e => e.value === estado)?.label ?? estado;
  }

  estadoColor(estado: EstadoCaso): string {
    return ESTADOS_CASO.find(e => e.value === estado)?.color ?? '#9e9e9e';
  }
}
