import { Injectable, signal } from '@angular/core';
import { CruceGremialRow, CruceGremialResumen, CruceGremialState } from '../models/types';

const STORAGE_KEY = 'unesie_cruce_gremial_v1';

// Mapea encabezados normalizados (sin tildes/espacios/guiones bajos, en minúsculas) del
// resultado_cruce_gremio.xlsx generado por cruce-gremial/cruce_gremial_unesie.py a los campos del modelo.
const COLUMN_MAP: Record<string, keyof CruceGremialRow> = {
  rut: 'rut',
  nombreunesie: 'nombre_unesie',
  correoelectronico: 'correo_electronico',
  calidadjuridica: 'calidad_juridica',
  unidaddesempeno: 'unidad_desempenio',
  nombretransparencia: 'nombre_transparencia',
  origentransparencia: 'origen_transparencia',
  estamento: 'estamento',
  grado: 'grado',
  calificacionprofesional: 'calificacion_profesional',
  cargo: 'cargo',
  rembrutatransparencia: 'rem_bruta_transparencia',
  hediurnas: 'he_diurnas',
  henocturnas: 'he_nocturnas',
  hefestivas: 'he_festivas',
  rembrutaescala: 'rem_bruta_escala',
  incrementoprevisionaldl3501: 'incremento_previsional_dl3501',
  baseimponibleprevisional: 'base_imponible_previsional',
  cuotagremialestimada: 'cuota_gremial_estimada',
  estadocruce: 'estado_cruce',
  scoresimilitudfuzzy: 'score_similitud_fuzzy',
};

const NUMERIC_FIELDS = new Set<keyof CruceGremialRow>([
  'grado', 'rem_bruta_transparencia', 'he_diurnas', 'he_nocturnas', 'he_festivas',
  'rem_bruta_escala', 'incremento_previsional_dl3501', 'base_imponible_previsional',
  'cuota_gremial_estimada', 'score_similitud_fuzzy',
]);

function normalizar(texto: string): string {
  return texto
    .toString()
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

const ESTADO_VACIO: CruceGremialState = { fecha_importacion: '', resumen: null, filas: [] };

@Injectable({ providedIn: 'root' })
export class CruceGremialService {
  private _state = signal<CruceGremialState>(ESTADO_VACIO);

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CruceGremialState;
        if (parsed && Array.isArray(parsed.filas)) this._state.set(parsed);
      } catch {}
    }
  }

  getState() {
    return this._state.asReadonly();
  }

  async importFromFile(file: File): Promise<{ filas: number }> {
    const XLSX = await import('xlsx');
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'array' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1, defval: null });

    // El archivo trae filas de título/resumen antes del encabezado real; buscamos la
    // fila que contiene la columna "RUT" para ubicar dónde empiezan los datos.
    const headerIdx = raw.findIndex(row => row.some(cell => normalizar(String(cell ?? '')) === 'rut'));
    if (headerIdx === -1) {
      throw new Error('No se encontró la fila de encabezados (columna "RUT") en el archivo.');
    }

    const headers = raw[headerIdx].map(h => normalizar(String(h ?? '')));
    const dataRows = raw.slice(headerIdx + 1).filter(row => row.some(cell => cell !== null && cell !== ''));

    const filas: CruceGremialRow[] = dataRows
      .map(row => {
        const fila: Record<string, unknown> = {};
        headers.forEach((h, i) => {
          const field = COLUMN_MAP[h];
          if (!field) return;
          const value = row[i];
          if (NUMERIC_FIELDS.has(field)) {
            fila[field] = value === null || value === '' ? undefined : Number(value);
          } else {
            fila[field] = value === null ? undefined : String(value).trim();
          }
        });
        return fila as unknown as CruceGremialRow;
      })
      .filter(f => f.rut || f.nombre_unesie);

    const nuevoEstado: CruceGremialState = {
      fecha_importacion: new Date().toISOString(),
      resumen: this.calcularResumen(filas),
      filas,
    };
    this._state.set(nuevoEstado);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevoEstado));
    return { filas: filas.length };
  }

  limpiar(): void {
    this._state.set(ESTADO_VACIO);
    localStorage.removeItem(STORAGE_KEY);
  }

  private calcularResumen(filas: CruceGremialRow[]): CruceGremialResumen {
    const exactos = filas.filter(f => (f.estado_cruce ?? '').toLowerCase() === 'exacto').length;
    const fuzzy = filas.filter(f => (f.estado_cruce ?? '').toLowerCase() === 'fuzzy').length;
    const recaudacion_proyectada = filas.reduce((sum, f) => sum + (f.cuota_gremial_estimada ?? 0), 0);
    return {
      total_socios: filas.length,
      exactos,
      fuzzy,
      no_encontrados: filas.length - exactos - fuzzy,
      recaudacion_proyectada,
    };
  }
}
