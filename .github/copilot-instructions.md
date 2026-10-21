<!--
Por qué este fichero es tan corto: es el que más superficies de Copilot leen sin depender de ajustes
(chat, agentes, code review en PR). Remite a AGENTS.md y duplica SOLO lo crítico: si AGENTS.md no se carga
en algún contexto, las reglas clave siguen llegando. Si crece, se desincroniza de AGENTS.md.
-->
Sigue siempre las reglas y comandos de AGENTS.md en la raíz del repositorio.
Recordatorios críticos:
- Nunca uses unsafeHTML ni innerHTML; pinta HTML no confiable con renderSanitizedHtml() y valida URLs con safeUrl().
- Todo fix lleva test con payload de ataque.
- Usa pnpm, nunca npm ni yarn.
- Responde en español.
