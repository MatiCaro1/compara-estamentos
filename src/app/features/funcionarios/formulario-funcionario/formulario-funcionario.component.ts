import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';
import { FuncionariosService } from '../../../core/services/funcionarios.service';
import { EscalaService } from '../../../core/services/escala.service';
import { Estamento, ESTAMENTOS } from '../../../core/models/types';

@Component({
  selector: 'app-formulario-funcionario',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, CurrencyPipe,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatCardModule, MatSnackBarModule,
  ],
  templateUrl: './formulario-funcionario.component.html',
  styleUrl: './formulario-funcionario.component.scss',
})
export class FormularioFuncionarioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(FuncionariosService);
  private escala = inject(EscalaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);

  readonly estamentos = ESTAMENTOS;
  readonly modoEdicion = signal(false);
  readonly funcionarioId = signal<string | null>(null);
  readonly grados = signal<number[]>([]);
  readonly remBruta = signal<number | null>(null);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    rut: [''],
    email: ['', Validators.email],
    telefono: [''],
    unidad: [''],
    estamento: ['' as Estamento, Validators.required],
    grado: [null as number | null, Validators.required],
    dirigente_captador: [''],
    notas: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion.set(true);
      this.funcionarioId.set(id);
      const f = this.svc.getById(id);
      if (!f) { this.router.navigate(['/funcionarios']); return; }
      this.form.patchValue({
        nombre: f.nombre,
        rut: f.rut ?? '',
        email: f.email ?? '',
        telefono: f.telefono ?? '',
        unidad: f.unidad ?? '',
        estamento: f.estamento,
        grado: f.grado,
        dirigente_captador: f.dirigente_captador ?? '',
        notas: f.notas ?? '',
      });
      this.onEstamentoChange(f.estamento);
    }
  }

  onEstamentoChange(estamento: Estamento | null | string): void {
    if (!estamento) return;
    const gs = this.escala.getGradosPorEstamento(estamento as Estamento);
    this.grados.set(gs);
    const grado = this.form.get('grado')!.value;
    if (grado && !gs.includes(grado)) this.form.get('grado')!.setValue(null);
    this.actualizarRem();
  }

  actualizarRem(): void {
    const est = this.form.get('estamento')!.value as Estamento;
    const grado = this.form.get('grado')!.value;
    if (est && grado) {
      const row = this.escala.lookup(est, grado);
      this.remBruta.set(row?.rem_bruta ?? null);
    } else {
      this.remBruta.set(null);
    }
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;

    const data = {
      nombre: v.nombre!,
      rut: v.rut || undefined,
      email: v.email || undefined,
      telefono: v.telefono || undefined,
      unidad: v.unidad || undefined,
      estamento: v.estamento as Estamento,
      grado: v.grado!,
      dirigente_captador: v.dirigente_captador || undefined,
      notas: v.notas || undefined,
    };

    if (this.modoEdicion() && this.funcionarioId()) {
      this.svc.update(this.funcionarioId()!, data);
      this.snack.open('Funcionario actualizado', 'OK', { duration: 3000 });
    } else {
      this.svc.save(data);
      this.snack.open('Funcionario registrado', 'OK', { duration: 3000 });
    }
    this.router.navigate(['/funcionarios']);
  }
}
