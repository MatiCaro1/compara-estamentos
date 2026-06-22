import { Component, inject, AfterViewInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuncionariosDashboardService } from '../../services/funcionarios.service';
import type { Funcionario, DashboardMetadata } from '../../models/funcionario.model';

@Component({
  selector: 'app-dashboard-rrhh',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardRrhhComponent implements AfterViewInit {
  private svc = inject(FuncionariosDashboardService);

  readonly metadata: DashboardMetadata = this.svc.getMetadata();
  readonly elegibles: Funcionario[] = this.svc.getElegibles();
  readonly proximosCumpleanos: Funcionario[] = this.svc.getProximosCumpleanos(90);
  readonly porcentajeMujeres: number;
  readonly escalafones: string[];
  readonly estados = ['Elegible', 'No Elegible', 'En Evaluación', 'Sin datos'];

  readonly columnsElegibles: string[] = ['nombre_completo', 'escalafon', 'grado_actual', 'anios_sin_cambio', 'estado'];
  readonly columnsGeneral: string[] = ['nombre_completo', 'rut', 'escalafon', 'grado_actual', 'calidad_juridica', 'anios_antiguedad', 'estado'];

  readonly dataSource = new MatTableDataSource<Funcionario>(this.svc.getFuncionarios());

  busqueda = '';
  filtroEscalafon = '';
  filtroEstado = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  constructor() {
    const all = this.svc.getFuncionarios();
    const mujeres = all.filter(f => f.sexo === 'Femenino').length;
    this.porcentajeMujeres = all.length > 0 ? Math.round((mujeres / all.length) * 100) : 0;
    this.escalafones = [
      ...new Set(all.map(f => f.escalafon).filter((s): s is string => s !== null)),
    ].sort();

    this.dataSource.filterPredicate = (data: Funcionario, filter: string) => {
      const { busqueda, escalafon, estado } = JSON.parse(filter) as {
        busqueda: string;
        escalafon: string;
        estado: string;
      };
      if (busqueda && !data.nombre_completo.toLowerCase().includes(busqueda)) return false;
      if (escalafon && data.escalafon !== escalafon) return false;
      if (estado && data.elegibilidad.estado !== estado) return false;
      return true;
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: Funcionario, property: string): string | number => {
      switch (property) {
        case 'nombre_completo':   return item.nombre_completo;
        case 'rut':               return item.rut;
        case 'escalafon':         return item.escalafon ?? '';
        case 'grado_actual':      return item.grado_actual ?? 0;
        case 'calidad_juridica':  return item.calidad_juridica ?? '';
        case 'anios_antiguedad':  return item.anios_antiguedad ?? 0;
        case 'estado':            return item.elegibilidad.estado ?? '';
        default:                  return '';
      }
    };
  }

  applyFilters(): void {
    this.dataSource.filter = JSON.stringify({
      busqueda: this.busqueda.toLowerCase().trim(),
      escalafon: this.filtroEscalafon,
      estado: this.filtroEstado,
    });
    this.dataSource.paginator?.firstPage();
  }

  clearFilters(): void {
    this.busqueda = '';
    this.filtroEscalafon = '';
    this.filtroEstado = '';
    this.applyFilters();
  }

  getBadgeClass(estado: string | null | undefined): string {
    switch (estado) {
      case 'Elegible': return 'badge badge-elegible';
      case 'No Elegible': return 'badge badge-no-elegible';
      case 'En Evaluación': return 'badge badge-evaluacion';
      default: return 'badge badge-sin-datos';
    }
  }

  getMes(mes: number | null): string {
    if (mes === null || mes < 1 || mes > 12) return '';
    return this.MESES[mes - 1];
  }

  getAniosSinCambio(f: Funcionario): number | null {
    return f.elegibilidad.años_desde_ultimo_cambio;
  }
}
