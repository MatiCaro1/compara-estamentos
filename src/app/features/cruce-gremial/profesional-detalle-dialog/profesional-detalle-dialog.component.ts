import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CruceGremialRow } from '../../../core/models/types';

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
  ],
  templateUrl: './profesional-detalle-dialog.component.html',
  styleUrl: './profesional-detalle-dialog.component.scss',
})
export class ProfesionalDetalleDialogComponent {
  readonly data = inject(MAT_DIALOG_DATA) as CruceGremialRow;

  estadoColor(estado: string | undefined): string {
    if (!estado) return '#9e9e9e';
    if (estado.toLowerCase() === 'exacto') return '#4caf50';
    if (estado.toLowerCase() === 'fuzzy') return '#ff9800';
    return '#f44336';
  }
}
