import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { StorageService } from '../../../core/services/storage.service';
import { ExportService } from '../../../core/services/export.service';
import { AppState } from '../../../core/models/types';

@Component({
  selector: 'app-export-import',
  standalone: true,
  imports: [
    FormsModule, DatePipe,
    MatCardModule, MatButtonModule, MatIconModule,
    MatDividerModule, MatFormFieldModule, MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './export-import.component.html',
  styleUrl: './export-import.component.scss',
})
export class ExportImportComponent {
  private storage = inject(StorageService);
  private exportService = inject(ExportService);
  private snack = inject(MatSnackBar);

  readonly metadata = this.storage.getMetadata;
  readonly casos = this.storage.getCasos();
  readonly dirigenteLocal = signal(this.storage.getMetadata().dirigente_local);
  readonly importResult = signal<{ added: number; skipped: number } | null>(null);
  readonly importError = signal('');

  guardarDirigente(): void {
    this.storage.updateMetadata({ dirigente_local: this.dirigenteLocal() });
    this.snack.open('Dirigente guardado', 'OK', { duration: 2000 });
  }

  exportJSON(): void {
    this.exportService.exportJSON();
    this.snack.open('JSON descargado', 'OK', { duration: 2500 });
  }

  exportExcel(): void {
    this.exportService.exportExcel(this.casos());
    this.snack.open('Excel descargado', 'OK', { duration: 2500 });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text) as AppState;

        if (!Array.isArray(data.casos)) {
          this.importError.set('El archivo no tiene el formato correcto (falta el campo "casos").');
          return;
        }

        const result = this.storage.importState(data);
        this.importResult.set(result);
        this.importError.set('');
        this.snack.open(`Importación completada: ${result.added} agregados, ${result.skipped} duplicados omitidos`, 'OK', { duration: 5000 });
      } catch {
        this.importError.set('Error al leer el archivo. Asegúrese de que sea un JSON válido.');
        this.importResult.set(null);
      }
      input.value = '';
    };
    reader.readAsText(file);
  }
}
