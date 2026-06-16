export type Estamento = 'Directivo' | 'Profesional' | 'Fiscalizador' | 'Técnico' | 'Administrativo' | 'Auxiliar';
export type EstadoCaso = 'pendiente' | 'en_gestion' | 'resuelto_favorable' | 'resuelto_desfavorable' | 'archivado';
export type FundamentoLegal = 'art_5_ley19296' | 'art_16_ley18834' | 'art_53_ley18834' | 'contraloria_dictamen' | 'otro';

export interface EscalaRow {
  grado: number;
  estamento: Estamento;
  sueldo_base: number;
  incremento_dl3501: number;
  asig_fiscalizacion: number;
  bon_salud: number;
  bon_previsional: number;
  asig_unica: number;
  ley18091_art17: number;
  asig_especial_art8: number;
  asig_desempenio_fija: number;
  asig_desempenio_variable: number;
  rem_bruta: number;
  anio: number;
}

export interface Nota {
  timestamp: string;
  texto: string;
}

export interface Caso {
  id: string;
  fecha_ingreso: string;
  fecha_actualizacion: string;
  nombre: string;
  rut?: string;
  unidad?: string;
  estamento_actual: Estamento;
  grado_actual: number;
  estamento_solicitado: Estamento;
  grado_solicitado: number;
  diff_mensual: number;
  diff_anual: number;
  pct_incremento: number;
  estado: EstadoCaso;
  fundamento_legal: FundamentoLegal;
  fundamento_detalle?: string;
  notas: Nota[];
  dirigente_responsable?: string;
  tiene_documentacion: boolean;
  descripcion_docs?: string;
}

export interface Funcionario {
  id: string;
  fecha_captacion: string;
  fecha_actualizacion: string;
  nombre: string;
  rut?: string;
  email?: string;
  telefono?: string;
  unidad?: string;
  estamento: Estamento;
  grado: number;
  dirigente_captador?: string;
  notas?: string;
}

export interface AppState {
  casos: Caso[];
  escala: EscalaRow[];
  metadata: {
    version: string;
    ultimo_export: string;
    dirigente_local: string;
  };
}

export const ESTAMENTOS: Estamento[] = [
  'Directivo', 'Profesional', 'Fiscalizador', 'Técnico', 'Administrativo', 'Auxiliar'
];

export const ESTADOS_CASO: { value: EstadoCaso; label: string; color: string }[] = [
  { value: 'pendiente',              label: 'Pendiente',              color: '#9e9e9e' },
  { value: 'en_gestion',             label: 'En Gestión',             color: '#ff9800' },
  { value: 'resuelto_favorable',     label: 'Resuelto Favorable',     color: '#4caf50' },
  { value: 'resuelto_desfavorable',  label: 'Resuelto Desfavorable',  color: '#f44336' },
  { value: 'archivado',              label: 'Archivado',              color: '#607d8b' },
];

export const FUNDAMENTOS_LEGALES: { value: FundamentoLegal; label: string; descripcion: string }[] = [
  {
    value: 'art_5_ley19296',
    label: 'Art. 5° Ley 19.296',
    descripcion: 'Reconocimiento de funciones: el directorio de la asociación podrá representar a los afiliados en materias de su competencia ante los organismos del Estado.'
  },
  {
    value: 'art_16_ley18834',
    label: 'Art. 16° Ley 18.834',
    descripcion: 'Ascenso por concurso: los funcionarios podrán ascender al grado inmediatamente superior mediante concurso interno de la carrera funcionaria.'
  },
  {
    value: 'art_53_ley18834',
    label: 'Art. 53° Ley 18.834',
    descripcion: 'Destinación: la autoridad facultada para hacer el nombramiento podrá destinar al funcionario a cualquier localidad o lugar del territorio nacional.'
  },
  {
    value: 'contraloria_dictamen',
    label: 'Dictamen CGR',
    descripcion: 'Dictamen de Contraloría General de la República que establece criterios de clasificación, reencasillamiento o ajuste de estamento.'
  },
  {
    value: 'otro',
    label: 'Otro fundamento',
    descripcion: 'Otro fundamento legal. Especifique en el campo de detalle.'
  },
];
