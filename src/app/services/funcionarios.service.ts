import { Injectable } from '@angular/core';
import rawData from '../../assets/data/funcionarios_dashboard.json';
import type {
  Funcionario,
  DashboardMetadata,
  ResumenElegibilidad,
  FuncionariosDashboardResponse,
} from '../models/funcionario.model';

@Injectable({ providedIn: 'root' })
export class FuncionariosDashboardService {
  private readonly data = rawData as unknown as FuncionariosDashboardResponse;

  getFuncionarios(): Funcionario[] {
    return this.data.funcionarios;
  }

  getMetadata(): DashboardMetadata {
    return this.data.metadata;
  }

  getElegibles(): Funcionario[] {
    return this.data.funcionarios
      .filter(f => f.elegibilidad.estado === 'Elegible')
      .sort(
        (a, b) =>
          (b.elegibilidad.años_desde_ultimo_cambio ?? 0) -
          (a.elegibilidad.años_desde_ultimo_cambio ?? 0)
      );
  }

  getProximosCumpleanos(diasLimite: number): Funcionario[] {
    return this.data.funcionarios
      .filter(
        f =>
          f.proximo_cumpleanos.dias_restantes !== null &&
          f.proximo_cumpleanos.dias_restantes >= 0 &&
          f.proximo_cumpleanos.dias_restantes <= diasLimite
      )
      .sort(
        (a, b) =>
          (a.proximo_cumpleanos.dias_restantes ?? 0) -
          (b.proximo_cumpleanos.dias_restantes ?? 0)
      );
  }

  getResumenElegibilidad(): ResumenElegibilidad {
    return this.data.metadata.resumen;
  }
}
