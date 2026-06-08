import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { StorageService } from '../../../core/services/storage.service';
import { EscalaService } from '../../../core/services/escala.service';
import {
  Caso, Estamento, EstadoCaso, FundamentoLegal,
  ESTAMENTOS, ESTADOS_CASO, FUNDAMENTOS_LEGALES
} from '../../../core/models/types';

@Component({
  selector: 'app-formulario-caso',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, CurrencyPipe, DecimalPipe,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatIconModule, MatCheckboxModule, MatCardModule, MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './formulario-caso.component.html',
  styleUrl: './formulario-caso.component.scss',
})
export class FormularioCasoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private storage = inject(StorageService);
  private escala = inject(EscalaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);

  readonly estamentos = ESTAMENTOS;
  readonly estadosMeta = ESTADOS_CASO;
  readonly fundamentosMeta = FUNDAMENTOS_LEGALES;

  readonly modoEdicion = signal(false);
  readonly casoId = signal<string | null>(null);

  readonly gradosActuales = signal<number[]>([]);
  readonly gradosSolicitados = signal<number[]>([]);

  readonly remActual = signal<number | null>(null);
  readonly remSolicitada = signal<number | null>(null);
  readonly diffMensual = signal<number | null>(null);
  readonly diffAnual = signal<number | null>(null);
  readonly pctIncremento = signal<number | null>(null);

  readonly fundamentoDescripcion = signal('');

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    rut: [''],
    unidad: [''],
    estamento_actual: ['' as Estamento, Validators.required],
    grado_actual: [null as number | null, Validators.required],
    estamento_solicitado: ['' as Estamento, Validators.required],
    grado_solicitado: [null as number | null, Validators.required],
    estado: ['pendiente' as EstadoCaso, Validators.required],
    fundamento_legal: ['art_5_ley19296' as FundamentoLegal, Validators.required],
    fundamento_detalle: [''],
    dirigente_responsable: [''],
    tiene_documentacion: [false],
    descripcion_docs: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion.set(true);
      this.casoId.set(id);
      const caso = this.storage.getById(id);
      if (!caso) { this.router.navigate(['/casos']); return; }
      this.form.patchValue({
        nombre: caso.nombre,
        rut: caso.rut ?? '',
        unidad: caso.unidad ?? '',
        estamento_actual: caso.estamento_actual,
        grado_actual: caso.grado_actual,
        estamento_solicitado: caso.estamento_solicitado,
        grado_solicitado: caso.grado_solicitado,
        estado: caso.estado,
        fundamento_legal: caso.fundamento_legal,
        fundamento_detalle: caso.fundamento_detalle ?? '',
        dirigente_responsable: caso.dirigente_responsable ?? '',
        tiene_documentacion: caso.tiene_documentacion,
        descripcion_docs: caso.descripcion_docs ?? '',
      });
      this.onEstamentoActualChange(caso.estamento_actual);
      this.onEstamentoSolicitadoChange(caso.estamento_solicitado);
      this.recalcular();
    }

    this.form.get('fundamento_legal')!.valueChanges.subscribe(val => {
      if (val) {
        const meta = FUNDAMENTOS_LEGALES.find(f => f.value === val);
        this.fundamentoDescripcion.set(meta?.descripcion ?? '');
      }
    });
    const initialFund = this.form.get('fundamento_legal')!.value;
    if (initialFund) {
      this.fundamentoDescripcion.set(FUNDAMENTOS_LEGALES.find(f => f.value === initialFund)?.descripcion ?? '');
    }
  }

  onEstamentoActualChange(estamento: Estamento | null | string): void {
    if (!estamento) return;
    const grados = this.escala.getGradosPorEstamento(estamento as Estamento);
    this.gradosActuales.set(grados);
    const grado = this.form.get('grado_actual')!.value;
    if (grado && !grados.includes(grado)) {
      this.form.get('grado_actual')!.setValue(null);
    }
    this.recalcular();
  }

  onEstamentoSolicitadoChange(estamento: Estamento | null | string): void {
    if (!estamento) return;
    const grados = this.escala.getGradosPorEstamento(estamento as Estamento);
    this.gradosSolicitados.set(grados);
    const grado = this.form.get('grado_solicitado')!.value;
    if (grado && !grados.includes(grado)) {
      this.form.get('grado_solicitado')!.setValue(null);
    }
    this.recalcular();
  }

  recalcular(): void {
    const ea = this.form.get('estamento_actual')!.value as Estamento;
    const ga = this.form.get('grado_actual')!.value;
    const es = this.form.get('estamento_solicitado')!.value as Estamento;
    const gs = this.form.get('grado_solicitado')!.value;

    const rowA = ea && ga ? this.escala.lookup(ea, ga) : null;
    this.remActual.set(rowA?.rem_bruta ?? null);

    if (ea && ga && es && gs) {
      const diff = this.escala.calcularDiff(
        { estamento: ea, grado: ga },
        { estamento: es, grado: gs }
      );
      if (diff) {
        this.remSolicitada.set(diff.rem_solicitada);
        this.diffMensual.set(diff.diff_mensual);
        this.diffAnual.set(diff.diff_anual);
        this.pctIncremento.set(diff.pct_incremento);
      }
    } else {
      this.remSolicitada.set(null);
      this.diffMensual.set(null);
      this.diffAnual.set(null);
      this.pctIncremento.set(null);
    }
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;

    const data: Omit<Caso, 'id' | 'fecha_ingreso' | 'fecha_actualizacion'> = {
      nombre: v.nombre!,
      rut: v.rut || undefined,
      unidad: v.unidad || undefined,
      estamento_actual: v.estamento_actual as Estamento,
      grado_actual: v.grado_actual!,
      estamento_solicitado: v.estamento_solicitado as Estamento,
      grado_solicitado: v.grado_solicitado!,
      diff_mensual: this.diffMensual() ?? 0,
      diff_anual: this.diffAnual() ?? 0,
      pct_incremento: this.pctIncremento() ?? 0,
      estado: v.estado as EstadoCaso,
      fundamento_legal: v.fundamento_legal as FundamentoLegal,
      fundamento_detalle: v.fundamento_detalle || undefined,
      notas: [],
      dirigente_responsable: v.dirigente_responsable || undefined,
      tiene_documentacion: v.tiene_documentacion ?? false,
      descripcion_docs: v.descripcion_docs || undefined,
    };

    if (this.modoEdicion() && this.casoId()) {
      const existing = this.storage.getById(this.casoId()!);
      this.storage.update(this.casoId()!, { ...data, notas: existing?.notas ?? [] });
      this.snack.open('Caso actualizado', 'OK', { duration: 3000 });
    } else {
      const nuevo = this.storage.save(data);
      this.snack.open('Caso creado', 'OK', { duration: 3000 });
      this.router.navigate(['/casos', nuevo.id]);
      return;
    }
    this.router.navigate(['/casos', this.casoId()]);
  }
}
