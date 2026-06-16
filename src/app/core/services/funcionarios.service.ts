import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Funcionario } from '../models/types';

const API = 'http://localhost:3000';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

@Injectable({ providedIn: 'root' })
export class FuncionariosService {
  private http = inject(HttpClient);
  private _funcionarios = signal<Funcionario[]>([]);

  constructor() {
    this.http.get<Funcionario[]>(`${API}/funcionarios`).subscribe({
      next: data => this._funcionarios.set(data),
      error: () => console.error('[FuncionariosService] No se pudo conectar con json-server.'),
    });
  }

  getFuncionarios() {
    return this._funcionarios.asReadonly();
  }

  getById(id: string): Funcionario | undefined {
    return this._funcionarios().find(f => f.id === id);
  }

  save(data: Omit<Funcionario, 'id' | 'fecha_captacion' | 'fecha_actualizacion'>): Funcionario {
    const now = new Date().toISOString();
    const nuevo: Funcionario = { ...data, id: generateUUID(), fecha_captacion: now, fecha_actualizacion: now };
    this._funcionarios.update(list => [...list, nuevo]);
    this.http.post<Funcionario>(`${API}/funcionarios`, nuevo).subscribe({
      error: e => console.error('[FuncionariosService] Error al guardar:', e),
    });
    return nuevo;
  }

  update(id: string, changes: Partial<Omit<Funcionario, 'id' | 'fecha_captacion'>>): Funcionario | null {
    let updated: Funcionario | null = null;
    this._funcionarios.update(list =>
      list.map(f => {
        if (f.id === id) {
          updated = { ...f, ...changes, fecha_actualizacion: new Date().toISOString() };
          return updated;
        }
        return f;
      })
    );
    if (updated) {
      this.http.put<Funcionario>(`${API}/funcionarios/${id}`, updated).subscribe({
        error: e => console.error('[FuncionariosService] Error al actualizar:', e),
      });
    }
    return updated;
  }

  delete(id: string): boolean {
    const prev = this._funcionarios().length;
    this._funcionarios.update(list => list.filter(f => f.id !== id));
    const deleted = this._funcionarios().length !== prev;
    if (deleted) {
      this.http.delete(`${API}/funcionarios/${id}`).subscribe({
        error: e => console.error('[FuncionariosService] Error al eliminar:', e),
      });
    }
    return deleted;
  }
}
