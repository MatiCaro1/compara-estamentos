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
  { path: '**', redirectTo: '' },
];
