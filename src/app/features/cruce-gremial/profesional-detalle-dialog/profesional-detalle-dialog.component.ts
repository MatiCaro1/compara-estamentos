import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CruceGremialRow } from '../../../core/models/types';
import { FuncionariosDashboardService } from '../../../services/funcionarios.service';
import type { Funcionario as FuncionarioRRHH } from '../../../models/funcionario.model';

@Component({
  selector: 'app-profesional-detalle-dialog',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './profesional-detalle-dialog.component.html',
  styleUrl: './profesional-detalle-dialog.component.scss',
})
export class ProfesionalDetalleDialogComponent {
  readonly data = inject(MAT_DIALOG_DATA) as CruceGremialRow;
  readonly rrhh: FuncionarioRRHH | null;

  constructor() {
    const svc = inject(FuncionariosDashboardService);
    const rutNorm = this.normalizeRut(this.data.rut ?? '');
    const todos = svc.getFuncionarios();

    console.group('[RRHH Dialog] Diagnóstico de match');
    console.log('RUT cruce (raw):      ', JSON.stringify(this.data.rut));
    console.log('RUT cruce (norm):     ', rutNorm);
    console.log('Funcionarios RRHH:    ', todos.length);
    if (todos.length > 0) {
      console.log('Primeros 3 RUTs RRHH:', todos.slice(0, 3).map(f => ({ raw: f.rut, norm: this.normalizeRut(f.rut) })));
    }
    this.rrhh = todos.find(f => this.normalizeRut(f.rut) === rutNorm) ?? null;
    console.log('Match encontrado:     ', this.rrhh ? this.rrhh.nombre_completo : 'NINGUNO');
    console.groupEnd();
  }

  estadoColor(estado: string | undefined): string {
    if (!estado) return '#9e9e9e';
    if (estado.toLowerCase() === 'exacto') return '#4caf50';
    if (estado.toLowerCase() === 'fuzzy') return '#ff9800';
    return '#f44336';
  }

  getBadgeClass(estado: string | null | undefined): string {
    switch (estado) {
      case 'Elegible':      return 'badge badge-elegible';
      case 'No Elegible':   return 'badge badge-no-elegible';
      case 'En Evaluación': return 'badge badge-evaluacion';
      default:              return 'badge badge-sin-datos';
    }
  }

  getAniosSinCambio(): number | null {
    return this.rrhh?.elegibilidad.años_desde_ultimo_cambio ?? null;
  }

  // Reduces any Chilean RUT format to the numeric body (no dots, no dash, no verifier).
  // Handles: "20.277.875-8", "20277875-8", "177406597" (body+verifier, no dash), "17740659"
  private normalizeRut(rut: string): string {
    const clean = rut.replace(/\./g, '').trim().toLowerCase();
    const dashIdx = clean.lastIndexOf('-');
    if (dashIdx >= 0) {
      return clean.substring(0, dashIdx);
    }
    // No dash: last char might be the verifier digit appended without separator.
    // Use the RUT check-digit algorithm to find out.
    if (clean.length >= 2) {
      const body = clean.slice(0, -1);
      if (this.calcVerifier(body) === clean.slice(-1)) {
        return body;
      }
    }
    return clean;
  }

  private calcVerifier(body: string): string {
    const digits = body.split('').reverse();
    let sum = 0;
    let mult = 2;
    for (const d of digits) {
      sum += parseInt(d, 10) * mult;
      mult = mult === 7 ? 2 : mult + 1;
    }
    const r = 11 - (sum % 11);
    if (r === 11) return '0';
    if (r === 10) return 'k';
    return r.toString();
  }
}
