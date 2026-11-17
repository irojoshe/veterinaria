# Convenciones de Git

Este proyecto usa **Conventional Commits** y ramas con formato `tipo/descripcion`. Las reglas son la fuente de verdad para nombres de rama, mensajes de commit y pull requests.

## Ramas

**Formato:** `tipo/descripcion-en-kebab-case`

```
feat/home-servicios-supabase
fix/menu-movil-tapa-navbar
chore/actualiza-lockfile
```

| Tipo | Cuándo se usa |
| --- | --- |
| `feat/` | Funcionalidad nueva para el usuario |
| `fix/` | Corrección de un comportamiento roto |
| `refactor/` | Reestructuración sin cambiar comportamiento |
| `chore/` | Tareas de mantenimiento (deps, config, tooling) |
| `docs/` | Documentación |
| `test/` | Pruebas |
| `perf/` | Rendimiento |
| `style/` | Formato sin cambios de comportamiento |

Reglas:

- Minúsculas y `kebab-case`; sin espacios, tildes ni fechas.
- Una rama = un tema. Si el cambio necesita dos temas, son dos ramas.
- La rama parte de `main` y nunca se commitea directo sobre `main`.
- El nombre describe el resultado, no el mecanismo: `feat/home-servicios-supabase`, no `feat/cambios-varios`.

## Commits

**Formato:** `tipo(ámbito): descripción`

```
feat(servicios): implementa logica real de Supabase con cache y cliente publico
fix(navbar): evita que el menu movil tapado se pinte sobre el header
docs(git): documenta las convenciones de ramas y commits
```

| Tipo | Cuándo se usa |
| --- | --- |
| `feat` | Funcionalidad nueva |
| `fix` | Corrección de bug |
| `refactor` | Reestructuración sin cambio de comportamiento |
| `chore` | Mantenimiento (deps, tooling, config) |
| `docs` | Documentación |
| `style` | Formato sin cambio de comportamiento |
| `test` | Pruebas |
| `perf` | Rendimiento |
| `build` | Build y empaquetado |
| `ci` | Integración continua |

Reglas:

- **Una unidad de trabajo por commit.** Un commit representa un comportamiento entregable, no un tipo de archivo.
- Descripción en **imperativo**: "añade", no "añadido" ni "se añade".
- Sin punto final, minúscula al inicio, cabecera de hasta ~72 caracteres.
- El cuerpo explica **por qué** y **cómo se verificó**, no qué archivos cambió.
- Las pruebas y la documentación accompany al comportamiento que verifican.
- `BREAKING CHANGE:` al pie si algo incompatible cambia.

### Ejemplos del historial de este repo

```
feat(home): complete Figma-aligned public home
feat(servicios): implementa logica real de Supabase con cache y cliente publico
fix: add project dependencies
refactor: Tailwind semantic tokens from Figma design system
build: Add Next.js configuration files
```

## Pull requests

- El título del PR sigue el mismo formato de commit convencional.
- La rama del PR usa `tipo/descripcion`.
- El cuerpo del PR indica: qué cambia, qué queda fuera de alcance y cómo se verificó.
- El PR apunta a `main`.
- Push y apertura del PR son decisiones del mantenedor; el agente deja la rama lista y verificada.

## Checklist antes de pushear

- [ ] La rama sigue `tipo/descripcion`.
- [ ] Cada commit es convencional y una unidad de trabajo.
- [ ] `npx tsc --noEmit` pasa (exit 0).
- [ ] No se commitean secretos ni artefactos de build.
- [ ] Los archivos generados (`node_modules`, `.next`) no están en el staging.
- [ ] El diff no incluye cambios ajenos al objetivo de la rama.

## Referencias

- `docs/estado-proyecto.md` — punto actual del proyecto.
- `docs/patterns/data-fetching.md` — reglas de obtención de datos.
- `odd/tasks/` — documentos de seguimiento por fase.
