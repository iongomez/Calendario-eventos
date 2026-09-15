# Calendario — Vista Salas (Iberdrola Eventos)

Prototipo funcional de la **Vista Salas** del módulo Calendario de MyHub (Gestor de Eventos Iberdrola), construido a partir del PRD `PRD-calendario-vista-salas.md` y un wireframe de referencia.

Muestra, en formato Gantt semanal, la ocupación de las salas de una sede: eventos multi-día como una única pastilla continua, resúmenes agregados de manutención/pernocta por día, filtros por sede/estado/espacio singular, y accesos a creación de evento y detalle de sala/evento (como stubs, fuera del alcance del PRD).

## Stack

React 19 + TypeScript + Vite + Tailwind CSS v4 + lucide-react. Sin backend — datos mock en `src/data/mockData.ts`, generados en relación a la fecha actual.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Alcance

Ver `PRD-calendario-vista-salas.md` (no incluido en este repo) para el detalle completo de requisitos. Explícitamente fuera de alcance: vistas Agenda/Logística/mensual, ficha completa de edición de evento, cambio de estado desde el calendario, exportación real a PDF/Excel, alertas de solapamiento de sala.
