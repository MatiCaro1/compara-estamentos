import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Caso, AppState } from '../models/types';
import { EscalaService } from './escala.service';

const API = 'http://localhost:3000';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private http = inject(HttpClient);
  private escalaService = inject(EscalaService);

  private _casos = signal<Caso[]>([]);
  private _metadata = signal<AppState['metadata']>({ version: '1.0.0', ultimo_export: '', dirigente_local: '' });

  constructor() {
    this.http.get<Caso[]>(`${API}/casos`).subscribe({
      next: casos => this._casos.set(casos),
      error: () => console.error('[StorageService] No se pudo conectar con json-server en puerto 3000. Ejecuta "npm start" para iniciar ambos servidores.'),
    });

    this.http.get<AppState['metadata']>(`${API}/metadata`).subscribe({
      next: meta => this._metadata.set(meta),
      error: () => {},
    });
  }

  getCasos() {
    return this._casos.asReadonly();
  }

  getAll(): Caso[] {
    return [...this._casos()];
  }

  getById(id: string): Caso | undefined {
    return this._casos().find(c => c.id === id);
  }

  save(data: Omit<Caso, 'id' | 'fecha_ingreso' | 'fecha_actualizacion'>): Caso {
    const now = new Date().toISOString();
    const nuevo: Caso = { ...data, id: generateUUID(), fecha_ingreso: now, fecha_actualizacion: now };
    this._casos.update(list => [...list, nuevo]);
    this.http.post<Caso>(`${API}/casos`, nuevo).subscribe({
      error: e => console.error('[StorageService] Error al guardar caso:', e),
    });
    return nuevo;
  }

  update(id: string, changes: Partial<Omit<Caso, 'id' | 'fecha_ingreso'>>): Caso | null {
    let updated: Caso | null = null;
    this._casos.update(list =>
      list.map(c => {
        if (c.id === id) {
          updated = { ...c, ...changes, fecha_actualizacion: new Date().toISOString() };
          return updated;
        }
        return c;
      })
    );
    if (updated) {
      this.http.put<Caso>(`${API}/casos/${id}`, updated).subscribe({
        error: e => console.error('[StorageService] Error al actualizar caso:', e),
      });
    }
    return updated;
  }

  delete(id: string): boolean {
    const prev = this._casos().length;
    this._casos.update(list => list.filter(c => c.id !== id));
    const deleted = this._casos().length !== prev;
    if (deleted) {
      this.http.delete(`${API}/casos/${id}`).subscribe({
        error: e => console.error('[StorageService] Error al eliminar caso:', e),
      });
    }
    return deleted;
  }

  getMetadata(): AppState['metadata'] {
    return this._metadata();
  }

  updateMetadata(meta: Partial<AppState['metadata']>): void {
    this._metadata.update(m => ({ ...m, ...meta }));
    this.http.put(`${API}/metadata`, this._metadata()).subscribe({
      error: e => console.error('[StorageService] Error al actualizar metadata:', e),
    });
  }

  getFullState(): AppState {
    return JSON.parse(JSON.stringify({
      casos: this._casos(),
      escala: this.escalaService.getEscala(),
      metadata: this._metadata(),
    }));
  }

  importState(imported: AppState): { added: number; skipped: number } {
    const existingIds = new Set(this._casos().map(c => c.id));
    const nuevos: Caso[] = [];
    let skipped = 0;
    for (const caso of (imported.casos ?? [])) {
      if (existingIds.has(caso.id)) skipped++;
      else nuevos.push(caso);
    }
    this._casos.update(list => [...list, ...nuevos]);
    if (imported.escala?.length) this.escalaService.replaceEscala(imported.escala);
    nuevos.forEach(caso =>
      this.http.post<Caso>(`${API}/casos`, caso).subscribe({
        error: e => console.error('[StorageService] Error al importar caso:', e),
      })
    );
    return { added: nuevos.length, skipped };
  }
}
