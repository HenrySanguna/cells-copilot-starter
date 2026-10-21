---
name: hardcoded-secret-response
description: Responde a un secreto expuesto en el código front (API key, token, credencial, clave privada, URL con credenciales). Úsala cuando secret scanning, un SAST o una revisión detecten un secreto en el repositorio o en el bundle.
disable-model-invocation: true
---
<!--
Por qué disable-model-invocation: un secreto expuesto es un incidente; esta skill solo debe ejecutarse cuando una
persona lo decide explícitamente con /hardcoded-secret-response, no porque el agente "crea" que aplica.
-->
1. **No copies el valor** del secreto en el chat, specs, tests, commits ni PR. Refiérete a él por fichero:línea.
2. Avisa a la persona de que el secreto debe **rotarse** ya: borrarlo del código no lo invalida, sigue en el historial de git y en bundles publicados. La rotación la hace una persona con el equipo responsable.
3. Determina si el secreto debe existir en el front:
   - Si es una clave pública por diseño (p. ej. clave publicable de un proveedor), documenta por qué y cierra como aceptado con aprobación de AppSec.
   - Si no, el front no debe tenerlo: la llamada debe pasar por un backend. Anótalo en el plan como dependencia de otro equipo.
4. Retira el valor del código y sustitúyelo por la configuración que indique el plan. Nunca por otro secreto en un `.env` versionado.
5. Añade un test o una regla que impida reintroducirlo si es posible (p. ej. un test que busque el patrón).
6. La limpieza del historial de git es decisión de AppSec; no reescribas historia.
