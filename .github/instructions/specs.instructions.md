---
applyTo: "specs/**/*.md"
description: "Formato de los artefactos del SDD ligero (spec, plan, tasks)"
---
<!-- Por qué: specs/ es el rastro que revisa una auditoría (spec → plan → tareas → código). Un formato fijo lo hace comparable. -->
- Una carpeta por hallazgo: `specs/<ID>/` con `spec.md`, `plan.md` y `tasks.md`. Parte de `specs/_template/`.
- `spec.md` = qué y por qué (hallazgo, vector, criterios de aceptación, fuera de alcance). Sin detalles de implementación.
- `plan.md` = cómo (ficheros, enfoque, riesgos de regresión, alternativas descartadas).
- `tasks.md` = pasos pequeños con casillas `- [ ]`, cada uno verificable con un comando. El primero siempre es el test que falla.
- Nunca pegues secretos, tokens ni datos personales reales; usa `<redactado>` y la ubicación (fichero:línea).
- No borres tareas hechas: márcalas `- [x]` para conservar el rastro.
