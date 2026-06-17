# Changelog

Todas las modificaciones notables a este proyecto serán documentadas en este archivo.

## [1.1.0] - 2026-06-17

### Añadido
- **Paginación Profesional**: Implementación de `MatPaginator` en la grilla de socios de Cruce Gremial.
- **Ordenamiento Dinámico**: Integración de `MatSort` para permitir el ordenamiento por cualquier columna en la tabla de socios.
- **Internacionalización**: Localización al español de las etiquetas del paginador ("Elementos por página", "Siguiente", "Anterior", etc.).

### Cambiado
- **Refactorización de Componentes**: El componente `ProfesionalDetalleDialogComponent` ha sido separado en archivos independientes (`.ts`, `.html`, `.scss`) y movido a su propia carpeta para una mejor mantenibilidad.
- **Gestión de Datos en Grilla**: Migración al uso de `MatTableDataSource` en `CruceGremialComponent` para un manejo más eficiente de datos filtrados, paginados y ordenados.
- **Mejoras de UI/UX**: Optimización de la visualización de la tabla con scroll horizontal responsivo y ajustes estéticos en el contenedor de datos.
