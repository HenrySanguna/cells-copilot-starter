<!-- Plantilla. Copia specs/_template/ a specs/<ID>/ o usa /security-spec. QUÉ y POR QUÉ; el CÓMO va en plan.md. -->
# <ID> — <título corto>

## 1. Hallazgo
- **ID**:
- **Herramienta de origen**: (SAST / pentest / Dependabot / pnpm audit / revisión)
- **Severidad**:
- **Fichero / componente**:
- **Fecha**:

## 2. Vector
- **Fuente no confiable**:
- **Sink**:
- **Impacto**:

## 3. Criterios de aceptación
<!-- Hallazgo de dependencia: en lugar de payloads, el aviso (CVE/GHSA) ya no aparece en `pnpm audit --prod` (o `pnpm audit:all` si es de desarrollo) y la versión es la parcheada mínima. -->
- [ ] Payloads neutralizados:
- [ ] Comportamiento funcional que no cambia:
- [ ] Evidencia: los tests del hallazgo fallan sin el fix, pasan con él y se ejecutan en CI con una instalación limpia.

## 4. Fuera de alcance
-

## 5. Referencias
- CWE:
- OWASP:
