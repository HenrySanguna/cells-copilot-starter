---
name: postmessage-hardening
description: Endurece la mensajería entre ventanas (window.postMessage, listeners de 'message', iframes, webviews). Úsala cuando un hallazgo señale un listener sin validar origen o un postMessage con destino '*'.
---
<!-- Por qué: las apps Cells se embeben en webviews y portales; cualquier ventana puede enviar mensajes a un listener sin validar. -->
1. Test primero: simula un `MessageEvent` con `origin: 'https://evil.example'` y datos maliciosos; debe demostrar que hoy se procesan.
2. Receptor (`addEventListener('message', ...)`):
   - Compara `event.origin` con una allowlist exacta de orígenes (igualdad de strings, nunca `includes` ni `startsWith`).
   - Valida la forma del mensaje (tipo, campos esperados, tipos de datos) antes de usarlo. Descarta lo desconocido.
   - Nunca pases datos del mensaje a un sink HTML o URL sin los wrappers de `src/security/`.
3. Emisor (`postMessage`):
   - Nunca uses `'*'` como `targetOrigin` si el mensaje lleva datos; usa el origen exacto.
   - No envíes tokens ni datos personales por `postMessage` si no es imprescindible.
4. Elimina el listener en `disconnectedCallback`.
5. `pnpm lint && pnpm test`.
