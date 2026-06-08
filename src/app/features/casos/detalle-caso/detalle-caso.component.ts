import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StorageService } from '../../../core/services/storage.service';
import { Caso, EstadoCaso, Nota, ESTADOS_CASO, FUNDAMENTOS_LEGALES } from '../../../core/models/types';

@Component({
  selector: 'app-detalle-caso',
  standalone: true,
  imports: [
    RouterLink, FormsModule, DatePipe, CurrencyPipe,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDividerModule, MatChipsModule, MatSnackBarModule,
  ],
  templateUrl: './detalle-caso.component.html',
  styleUrl: './detalle-caso.component.scss',
})
export class DetalleCasoComponent implements OnInit {
  private storage = inject(StorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  readonly caso = signal<Caso | null>(null);
  readonly nuevaNota = signal('');
  readonly estadosMeta = ESTADOS_CASO;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/casos']); return; }
    const c = this.storage.getById(id);
    if (!c) { this.router.navigate(['/casos']); return; }
    this.caso.set({ ...c });
  }

  estadoLabel(e: EstadoCaso): string {
    return ESTADOS_CASO.find(s => s.value === e)?.label ?? e;
  }

  estadoColor(e: EstadoCaso): string {
    return ESTADOS_CASO.find(s => s.value === e)?.color ?? '#9e9e9e';
  }

  fundamentoLabel(val: string): string {
    return FUNDAMENTOS_LEGALES.find(f => f.value === val)?.label ?? val;
  }

  cambiarEstado(nuevoEstado: EstadoCaso): void {
    const c = this.caso();
    if (!c) return;
    const updated = this.storage.update(c.id, { estado: nuevoEstado });
    if (updated) { this.caso.set({ ...updated }); }
    this.snack.open('Estado actualizado', 'OK', { duration: 2500 });
  }

  agregarNota(): void {
    const texto = this.nuevaNota().trim();
    if (!texto) return;
    const c = this.caso();
    if (!c) return;
    const nota: Nota = { timestamp: new Date().toISOString(), texto };
    const updated = this.storage.update(c.id, { notas: [...c.notas, nota] });
    if (updated) { this.caso.set({ ...updated }); }
    this.nuevaNota.set('');
    this.snack.open('Nota agregada', 'OK', { duration: 2000 });
  }

  eliminar(): void {
    const c = this.caso();
    if (!c) return;
    if (!confirm(`¿Eliminar el caso de "${c.nombre}"?`)) return;
    this.storage.delete(c.id);
    this.router.navigate(['/casos']);
  }
}
