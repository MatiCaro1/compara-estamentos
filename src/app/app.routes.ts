import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'casos',
    loadComponent: () => import('./features/casos/lista-casos/lista-casos.component').then(m => m.ListaCasosComponent),
  },
  {
    path: 'casos/nuevo',
    loadComponent: () => import('./features/casos/formulario-caso/formulario-caso.component').then(m => m.FormularioCasoComponent),
  },
  {
    path: 'casos/:id',
    loadComponent: () => import('./features/casos/detalle-caso/detalle-caso.component').then(m => m.DetalleCasoComponent),
  },
  {
    path: 'casos/:id/editar',
    loadComponent: () => import('./features/casos/formulario-caso/formulario-caso.component').then(m => m.FormularioCasoComponent),
  },
  {
    path: 'escala',
    loadComponent: () => import('./features/escala/escala.component').then(m => m.EscalaComponent),
  },
  {
    path: 'comparador',
    loadComponent: () => import('./shared/components/comparador/comparador.component').then(m => m.ComparadorComponent),
  },
  {
    path: 'exportar',
    loadComponent: () => import('./shared/components/export-import/export-import.component').then(m => m.ExportImportComponent),
  },
  {
    path: 'funcionarios',
    loadComponent: () => import('./features/funcionarios/lista-funcionarios/lista-funcionarios.component').then(m => m.ListaFuncionariosComponent),
  },
  {
    path: 'funcionarios/nuevo',
    loadComponent: () => import('./features/funcionarios/formulario-funcionario/formulario-funcionario.component').then(m => m.FormularioFuncionarioComponent),
  },
  {
    path: 'funcionarios/:id/editar',
    loadComponent: () => import('./features/funcionarios/formulario-funcionario/formulario-funcionario.component').then(m => m.FormularioFuncionarioComponent),
  },
  {
    path: 'cruce-gremial',
    loadComponent: () => import('./features/cruce-gremial/cruce-gremial.component').then(m => m.CruceGremialComponent),
  },
  {
    path: 'rrhh',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardRrhhComponent),
  },
  { path: '**', redirectTo: '' },
];
