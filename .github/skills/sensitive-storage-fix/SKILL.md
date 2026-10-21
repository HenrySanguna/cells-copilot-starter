---
name: sensitive-storage-fix
description: Elimina tokens, credenciales y datos personales de localStorage, sessionStorage, IndexedDB, cookies accesibles por JS y logs de consola. Úsala cuando un hallazgo señale almacenamiento o registro de datos sensibles en el navegador.
---
<!-- Por qué: cualquier XSS lee todo lo que hay en storage; lo que no se guarda no se puede robar. -->
1. Test primero: tras el flujo afectado (login, consulta...), comprueba que `localStorage`/`sessionStorage` no contienen la clave sensible; debe fallar.
2. Clasifica el dato:
   - **Contraseña / PIN / OTP** → nunca se guarda. Elimina la escritura.
   - **Token de sesión** → idealmente cookie `HttpOnly; Secure; SameSite` puesta por el servidor (fuera del alcance del front: anótalo en el plan). En el front, mantenlo solo en memoria.
   - **Datos personales** (IBAN, DNI, saldos) → solo en memoria del componente o del canal de Open Cells; no persistir.
3. Añade limpieza: borra cualquier valor legado al hacer logout y al arrancar la app (migración de datos antiguos).
4. Elimina `console.*` que impriman tokens, respuestas de API o datos de usuario.
5. `pnpm lint && pnpm test`.

Si el dato hay que persistirlo por requisito de negocio, para y pregunta: no es una decisión del agente.
