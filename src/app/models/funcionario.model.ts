export interface ProximoCumpleanos {
  mes: number | null;
  dia: number | null;
  fecha_iso: string | null;
  dias_restantes: number | null;
}

export interface ElegibilidadGrado {
  estado: 'Elegible' | 'No Elegible' | 'En Evaluación' | 'Sin datos';
  años_desde_ultimo_cambio: number | null;
  fecha_referencia_cambio: string | null;
  usa_ingreso_como_proxy: boolean;
  advertencia: string | null;
}

export interface Funcionario {
  rut: string;
  nombre_completo: string;
  sexo: 'Masculino' | 'Femenino' | 'Desconocido';
  fecha_nacimiento: string | null;
  edad_actual: number | null;
  proximo_cumpleanos: ProximoCumpleanos;
  escalafon: string | null;
  calidad_juridica: string | null;
  grado_actual: number | null;
  cargo: string | null;
  unidad_desempeno: string | null;
  centro_costo: string | null;
  num_bienios: number | null;
  ingreso_serv: string | null;
  anios_antiguedad: number | null;
  ultimo_cambio_grado: string | null;
  elegibilidad: ElegibilidadGrado;
  categoria_priorizacion: string | null;
  con_mejora_desde_2018: string | null;
}

export interface ResumenElegibilidad {
  Elegible?: number;
  'No Elegible'?: number;
  'En Evaluación'?: number;
  'Sin datos'?: number;
}

export interface DashboardMetadata {
  fecha_proceso: string;
  total_funcionarios: number;
  umbral_elegibilidad_anios: number;
  fuente: string;
  resumen: ResumenElegibilidad;
}

export interface FuncionariosDashboardResponse {
  metadata: DashboardMetadata;
  funcionarios: Funcionario[];
}
