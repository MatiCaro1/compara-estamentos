import { Injectable } from '@angular/core';
import { Caso, AppState, ESTADOS_CASO, FUNDAMENTOS_LEGALES } from '../models/types';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ExportService {
  constructor(private storage: StorageService) {}

  exportJSON(): void {
    const state = this.storage.getFullState();
    state.metadata.ultimo_export = new Date().toISOString();
    this.storage.updateMetadata({ ultimo_export: state.metadata.ultimo_export });
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    this.download(blob, `unesie_casos_${this.dateStamp()}.json`);
  }

  exportExcel(casos: Caso[]): void {
    import('xlsx').then(XLSX => {
      const rows = casos.map(c => ({
        Nombre: c.nombre,
        RUT: c.rut ?? '',
        Unidad: c.unidad ?? '',
        'Est. Actual': c.estamento_actual,
        'Grado Actual': c.grado_actual,
        'Rem. Actual': c.diff_mensual !== 0
          ? (c.diff_mensual > 0 ? c.diff_mensual + c.diff_mensual : 0) : 0,
        'Est. Solicitado': c.estamento_solicitado,
        'Grado Solicitado': c.grado_solicitado,
        'Diff Mensual': c.diff_mensual,
        'Diff Anual': c.diff_anual,
        '% Incremento': c.pct_incremento.toFixed(2) + '%',
        Estado: ESTADOS_CASO.find(e => e.value === c.estado)?.label ?? c.estado,
        'Fundamento Legal': FUNDAMENTOS_LEGALES.find(f => f.value === c.fundamento_legal)?.label ?? c.fundamento_legal,
        'Tiene Documentación': c.tiene_documentacion ? 'Sí' : 'No',
        Dirigente: c.dirigente_responsable ?? '',
        Notas: c.notas.map(n => `[${new Date(n.timestamp).toLocaleString('es-CL')}] ${n.texto}`).join(' | '),
        'Fecha Ingreso': new Date(c.fecha_ingreso).toLocaleDateString('es-CL'),
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Casos');
      XLSX.writeFile(wb, `unesie_casos_${this.dateStamp()}.xlsx`);
    });
  }

  private download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  private dateStamp(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
