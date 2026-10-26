---
applyTo: "src/security/**"
description: "Reglas para el código de seguridad compartido (sanitize, safe-url)"
---
<!-- Por qué un fichero propio: un cambio aquí afecta a TODOS los componentes. Es el código con más riesgo del repo. -->
# Código de seguridad compartido
- Estos wrappers son el único punto de entrada para HTML no confiable y URLs dinámicas. No crees alternativas en otros ficheros.
- Nunca amplíes una allowlist (esquemas de URL, etiquetas o atributos de DOMPurify) sin un hallazgo que lo pida explícitamente.
- `renderSanitizedHtml()` es el único uso permitido de unsafeHTML del proyecto. No añadas otro.
- No modifiques estos ficheros, tampoco para endurecerlos, salvo que un test **nuevo** con el payload del hallazgo **falle con el código actual**. Antes de proponer un cambio, revisa los tests existentes (`src/security/*.test.ts`): si ya cubren el payload, el fix va en el componente que no usa el wrapper.
- Cualquier cambio exige: ese test que falla antes y pasa después, ejecución de toda la suite y revisión con el agente `security-reviewer`.
- Cuando un cambio esté justificado, dentro del wrapper prefiere bloquear de más (devolver `undefined` o string vacío) a dejar pasar un caso dudoso. Esto no justifica cambiar el wrapper por sí solo.
- Estos ficheros están en CODEOWNERS: la PR necesitará aprobación de AppSec.
