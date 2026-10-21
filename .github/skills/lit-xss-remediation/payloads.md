# Payloads de prueba

Úsalos en tests (`it.each`). Un payload neutralizado aparece como texto o desaparece; nunca como nodo o atributo ejecutable.

## Contenido HTML
- `<img src=x onerror=alert(1)>`
- `"><svg onload=alert(1)>`
- `<script>alert(1)</script>`
- `<iframe src="javascript:alert(1)"></iframe>`
- `<a href="javascript:alert(1)">x</a>`
- `<details open ontoggle=alert(1)>`
- `<math><mtext><table><mglyph><style><img src=x onerror=alert(1)>` (mutation XSS)
- `<form action="https://evil.example"><input name=pwd></form>` (phishing visual)

## Atributos URL
- `javascript:alert(1)`
- `JaVaScRiPt:alert(1)`
- `java\tscript:alert(1)` (tab dentro del esquema)
- ` javascript:alert(1)` (espacio inicial)
- `data:text/html,<script>alert(1)</script>`
- `vbscript:msgbox(1)`

## Redirecciones
- `https://evil.example/phish`
- `//evil.example/phish`
- `/\evil.example`
- `javascript:alert(1)`

## Atributos sin comillas / ruptura de contexto
- `x onmouseover=alert(1)`
- `" autofocus onfocus=alert(1) x="`
