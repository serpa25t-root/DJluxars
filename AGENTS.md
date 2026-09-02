# Reglas para OpenCode / Agentes IA

## Uso de Agent Skills

Este proyecto utiliza las **agent-skills** de addyosmani. Siempre que llegue una tarea, usa la meta-skill `using-agent-skills` para descubrir cuál skill aplicar según la fase del desarrollo.

Antes de implementar cualquier cosa, consulta `/references/using-agent-skills/SKILL.md` para identificar la skill correspondiente.

## Workflow

1. Al llegar una tarea → invocar `using-agent-skills` para identificar la fase
2. Seguir la skill correspondiente paso a paso
3. Verificar siempre con evidencia (tests, build, runtime)
4. Hacer commit en español tras completar cada tarea
5. Pushear a la rama actual

## Commits y Push
- Crea un commit descriptivo en español y haz `git push` a la rama actual.
- Antes de pushear, muestra los archivos modificados y pide confirmación si hay cambios destructivos.

## Ramas
- Para cambios experimentales, crea una rama nueva: `git checkout -b feature/descripcion-breve`.
- No pushees directamente a `main` sin preguntar si el cambio es mayor.
