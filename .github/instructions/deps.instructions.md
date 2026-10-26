---
applyTo: "**/package.json,pnpm-workspace.yaml,pnpm-lock.yaml"
description: "Remediación de vulnerabilidades en dependencias (pnpm)"
---
<!-- Por qué pnpm y no npm en estas reglas: los overrides y la política de cadena de suministro viven en pnpm-workspace.yaml. -->
- Actualiza a la versión parcheada mínima que resuelva el aviso (CVE/GHSA). No subas majors "de paso".
- Dependencia directa → `pnpm update <paquete>@<versión>`. Transitiva → `overrides:` en `pnpm-workspace.yaml`, citando el ID del aviso en un comentario y en la PR.
- No añadas dependencias nuevas sin justificarlo en el spec. No cambies el registro.
- No relajes `minimumReleaseAge`, `trustPolicy`, `blockExoticSubdeps` ni `allowBuilds` para que una instalación pase: es justo lo que esas reglas deben frenar. Si bloquean, documenta el caso y pregunta.
- No edites `pnpm-lock.yaml` a mano; lo regenera pnpm.
- Verificación: `pnpm install --frozen-lockfile && pnpm audit --prod && pnpm test`. Si el aviso es de una dependencia de desarrollo, `pnpm audit:all` en lugar de `pnpm audit --prod`.
