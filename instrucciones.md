Eres un desarrollador senior Angular especializado en aplicaciones de gestión 
para el sector público chileno. Debes construir una aplicación Angular standalone 
(sin backend) que gestione casos de ajuste de remuneraciones para UNESIE, 
asociación gremial de la Superintendencia.

═══════════════════════════════════════════
CONTEXTO DE NEGOCIO
═══════════════════════════════════════════
La aplicación registra casos de funcionarios que solicitan ajuste de estamento 
o grado. La escala de remuneraciones es fija por año (se actualiza 1-2 veces al 
año como hardcode o JSON importable). El equipo es de 3-5 dirigentes que usan 
la app en sus propios equipos y sincronizan via export/import JSON.

Marco legal relevante: Ley 19.296, Ley 18.834 (Estatuto Administrativo), 
DL 3.551, Ley 18.566, Ley 18.675, Ley 18.717, Ley 18.091, Ley 20.212.

═══════════════════════════════════════════
STACK Y RESTRICCIONES
═══════════════════════════════════════════
- Angular 17+ standalone components (sin NgModules)
- Angular Material para UI
- localStorage como única persistencia (clave: 'unesie_casos_v1')
- Sin backend, sin autenticación
- TypeScript estricto
- SCSS para estilos
- ng generate para scaffolding

═══════════════════════════════════════════
MODELOS DE DATOS (interfaces TypeScript)
═══════════════════════════════════════════

interface EscalaRow {
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
  anio: number; // 2026
}

type Estamento = 'Directivo' | 'Profesional' | 'Fiscalizador' | 
                 'Técnico' | 'Administrativo' | 'Auxiliar';

type EstadoCaso = 'pendiente' | 'en_gestion' | 'resuelto_favorable' | 
                  'resuelto_desfavorable' | 'archivado';

type FundamentoLegal = 
  | 'art_5_ley19296'        // Reconocimiento de funciones
  | 'art_16_ley18834'       // Ascenso por concurso
  | 'art_53_ley18834'       // Destinación
  | 'contraloria_dictamen'  // Dictamen CGR
  | 'otro';

interface Caso {
  id: string;                    // UUID v4
  fecha_ingreso: string;         // ISO date
  fecha_actualizacion: string;   // ISO date
  
  // Datos del funcionario
  nombre: string;
  rut?: string;                  // Opcional, para búsqueda
  unidad?: string;               // Unidad organizacional
  
  // Posición actual
  estamento_actual: Estamento;
  grado_actual: number;
  
  // Posición solicitada
  estamento_solicitado: Estamento;
  grado_solicitado: number;
  
  // Análisis económico (calculado automáticamente)
  diff_mensual: number;
  diff_anual: number;
  pct_incremento: number;
  
  // Gestión
  estado: EstadoCaso;
  fundamento_legal: FundamentoLegal;
  fundamento_detalle?: string;
  notas: string[];               // Array de notas con timestamp
  dirigente_responsable?: string;
  
  // Documentos
  tiene_documentacion: boolean;
  descripcion_docs?: string;
}

interface AppState {
  casos: Caso[];
  escala: EscalaRow[];
  metadata: {
    version: string;
    ultimo_export: string;
    dirigente_local: string;   // Quién usa esta instancia
  };
}

═══════════════════════════════════════════
ESTRUCTURA DE LA APLICACIÓN
═══════════════════════════════════════════

src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── storage.service.ts      // CRUD en localStorage
│   │   │   ├── escala.service.ts       // Lookup y cálculo de diferencias
│   │   │   └── export.service.ts       // Export JSON / Excel
│   │   └── models/
│   │       └── types.ts
│   ├── features/
│   │   ├── dashboard/                  // Vista resumen + métricas
│   │   ├── casos/
│   │   │   ├── lista-casos/            // Tabla con filtros
│   │   │   ├── formulario-caso/        // Alta y edición
│   │   │   └── detalle-caso/           // Vista completa + notas
│   │   └── escala/                     // Visualización de la escala
│   └── shared/
│       └── components/
│           ├── comparador/             // Comparador estamento/grado
│           └── export-import/          // Panel de sync entre dirigentes

═══════════════════════════════════════════
FUNCIONALIDADES REQUERIDAS (en orden)
═══════════════════════════════════════════

FASE 1 — CRUD básico:
1. StorageService con métodos: getAll(), getById(), save(), update(), delete()
2. EscalaService con: lookup(estamento, grado), calcularDiff(desde, hasta), 
   getGradosPorEstamento()
3. Formulario de caso con cálculo automático al seleccionar posiciones
4. Lista de casos con filtro por estado y estamento

FASE 2 — Análisis:
5. Dashboard con tarjetas: total casos, costo mensual acumulado, costo anual, 
   casos resueltos favorablemente
6. Gráfico de barras: costo por caso (usando Chart.js o Angular Material)
7. Comparador reutilizable estamento/grado (componente standalone)

FASE 3 — Colaboración:
8. Export a JSON (descarga el AppState completo)
9. Import desde JSON (merge inteligente: no duplica por id, pregunta conflictos)
10. Export a Excel con columnas: Nombre, RUT, Est.Actual, Grado Actual, 
    Rem.Actual, Est.Solicitado, Grado Solicitado, Rem.Solicitada, 
    Diff Mensual, Diff Anual, Estado, Fundamento Legal, Notas

═══════════════════════════════════════════
DATOS DE LA ESCALA 2026 (hardcode inicial)
═══════════════════════════════════════════

[INSERTAR AQUÍ EL JSON DE LA ESCALA — ver bloque separado]

Usa este array como valor inicial en EscalaService. Debe poder reemplazarse
importando un JSON externo sin recompilar la app.

═══════════════════════════════════════════
COMPORTAMIENTO ESPERADO
═══════════════════════════════════════════

- Al seleccionar estamento_actual + grado_actual en el formulario, 
  mostrar inmediatamente la rem_bruta actual
- Al seleccionar estamento_solicitado + grado_solicitado, calcular y mostrar:
  · Diferencia mensual (puede ser negativa si el grado sube en número)
  · Diferencia anual
  · % de incremento
- El campo fundamento_legal debe desplegar texto de ayuda con el artículo 
  correspondiente de la ley
- Las notas son append-only con timestamp automático (no editables)
- El estado del caso tiene colores semáforo en la lista:
  · pendiente → gris
  · en_gestion → amarillo
  · resuelto_favorable → verde
  · resuelto_desfavorable → rojo
  · archivado → azul apagado

═══════════════════════════════════════════
INSTRUCCIONES DE ENTREGA
═══════════════════════════════════════════

Entrega fase por fase. Para cada fase:
1. Lista los archivos que vas a crear/modificar
2. Entrega el código completo de cada archivo
3. Indica el comando ng generate si aplica
4. Señala si hay dependencias que instalar (npm install)
5. Al final de la fase, muestra cómo verificar que funciona

Empieza con: ng new unesie-gestion --standalone --routing --style=scss
y luego la instalación de Angular Material.

