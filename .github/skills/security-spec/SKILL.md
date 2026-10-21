---
name: security-spec
description: Crea specs/<ID>/spec.md a partir de un hallazgo de seguridad (SAST, pentest, auditoría de dependencias). Úsala al empezar cualquier hallazgo nuevo, antes de planificar o tocar código.
argument-hint: "<ID> <herramienta> <severidad> <fichero o componente> <descripción>"
---
<!--
Por qué es la fase 1: escribir QUÉ hay que conseguir antes del CÓMO evita que la IA "arregle" otra cosa.
La description es lo más importante de una skill: es lo único que el agente ve hasta decidir cargarla.
-->
Genera `specs/<ID>/spec.md` copiando la estructura de `specs/_template/spec.md`:

1. **Hallazgo**: ID, herramienta de origen, severidad, fichero/componente, fecha.
2. **Vector**: fuente de datos no confiable → sink → impacto. Con fichero:línea si se conoce.
3. **Criterios de aceptación**:
   - Payloads que deben quedar neutralizados (mínimo los de `.github/skills/lit-xss-remediation/payloads.md` que apliquen).
   - Comportamiento funcional que NO debe cambiar.
4. **Fuera de alcance**: lo que no se toca en este hallazgo.
5. **Referencias**: CWE, OWASP, aviso CVE/GHSA si aplica.

Reglas:
- Si falta información del hallazgo (ID, ubicación, severidad), pregunta antes de escribir.
- No describas la solución técnica: eso va en `plan.md`.
- Nunca copies secretos ni datos personales del informe; usa `<redactado>`.
- Crea también `plan.md` y `tasks.md` vacíos desde `specs/_template/` para que el planner los rellene.
