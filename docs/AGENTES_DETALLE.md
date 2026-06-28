# Agentes Personalizados Instalados

Este documento detalla los agentes de IA (subagentes) instalados y configurados localmente en este sistema, bajo el directorio de configuración de Gemini (`C:\Users\Sebastian\.gemini\config\agents`).

---

## Índice de Agentes

| Nombre | Descripción |
| :--- | :--- |
| **[ai-team-dev](#ai-team-dev)** | Agente de desarrollo en equipo (Nova/Frontend, Sage/Backend, Milo/Visual). |
| **[api-architect](#api-architect)** | Diseñador y generador de APIs estructuradas por capas (Node.js/Express). |
| **[expert-react-frontend-engineer](#expert-react-frontend-engineer)** | Ingeniero frontend experto en React 19.2, TypeScript y optimización de rendimiento. |
| **[gilfoyle](#gilfoyle)** | Agente de revisión de código con la personalidad mordaz y sarcástica de Bertram Gilfoyle. |
| **[implementation-plan](#implementation-plan)** | Generador de planes de implementación deterministas y listos para ejecutar. |
| **[qa](#qa)** | Subagente de QA meticuloso para pruebas, búsqueda de bugs y verificación de casos límite. |
| **[se-ux-ui-designer](#se-ux-ui-designer)** | Diseñador UX enfocado en análisis de Jobs-to-be-Done y mapeo de la experiencia de usuario. |
| **[swe](#swe)** | Ingeniero de software senior para tareas de desarrollo, depuración y refactorización. |

---

## Detalles de los Agentes

### ai-team-dev
* **Nombre de configuración:** `ai-team-dev`
* **Descripción:** AI development team agent (Nova, Sage, Milo). Use when: building features, writing application code, fixing bugs, implementing UI components, creating APIs, styling with CSS, writing database queries, or executing sprint plans. The team switches between frontend, backend, and design roles as needed.
* **Herramientas habilitadas:**
  * `search`, `read`, `edit`, `execute`, `web`

### api-architect
* **Nombre de configuración:** `api-architect`
* **Descripción:** Your role is that of an API architect. Help mentor the engineer by providing guidance, support, and working code for REST APIs.
* **Herramientas habilitadas:**
  * `search`, `read`, `edit`, `execute`, `web`

### expert-react-frontend-engineer
* **Nombre de configuración:** `expert-react-frontend-engineer`
* **Descripción:** Expert React 19.2 frontend engineer specializing in modern hooks, Server Components, Actions, TypeScript, and performance optimization.
* **Herramientas habilitadas:**
  * `changes`, `codebase`, `edit/editFiles`, `extensions`, `fetch`, `findTestFiles`, `githubRepo`, `new`, `openSimpleBrowser`, `problems`, `runCommands`, `runTasks`, `runTests`, `search`, `searchResults`, `terminalLastCommand`, `terminalSelection`, `testFailure`, `usages`, `vscodeAPI`, `microsoft.docs.mcp`

### gilfoyle
* **Nombre de configuración:** `gilfoyle`
* **Descripción:** Code review and analysis with the sardonic wit and technical elitism of Bertram Gilfoyle from Silicon Valley. Prepare for brutal honesty about your code.
* **Herramientas habilitadas:**
  * `changes`, `codebase`, `web/fetch`, `findTestFiles`, `githubRepo`, `openSimpleBrowser`, `problems`, `search`, `searchResults`, `terminalLastCommand`, `terminalSelection`, `usages`, `vscodeAPI`

### implementation-plan
* **Nombre de configuración:** `implementation-plan`
* **Descripción:** Generate an implementation plan for new features or refactoring existing code.
* **Herramientas habilitadas:**
  * `search/codebase`, `search/usages`, `vscode/vscodeAPI`, `read/problems`, `execute/testFailure`, `read/terminalSelection`, `read/terminalLastCommand`, `vscode/openSimpleBrowser`, `web/fetch`, `vscode/extensions`, `edit/editFiles`, `vscode/getProjectSetupInfo`, `vscode/installExtension`, `vscode/newWorkspace`, `vscode/runCommand`, `execute/getTerminalOutput`, `execute/runInTerminal`, `execute/createAndRunTask`, `execute/getTaskOutput`, `execute/runTask`

### qa
* **Nombre de configuración:** `qa`
* **Descripción:** Meticulous QA subagent for test planning, bug hunting, edge-case analysis, and implementation verification.
* **Herramientas habilitadas:**
  * `vscode`, `execute`, `read`, `agent`, `edit`, `search`, `web`, `todo`

### se-ux-ui-designer
* **Nombre de configuración:** `SE: UX Designer` (`se-ux-ui-designer`)
* **Descripción:** Jobs-to-be-Done analysis, user journey mapping, and UX research artifacts for Figma and design workflows.
* **Herramientas habilitadas:**
  * `codebase`, `edit/editFiles`, `search`, `web/fetch`

### swe
* **Nombre de configuración:** `swe`
* **Descripción:** Senior software engineer subagent for implementation tasks: feature development, debugging, refactoring, and testing.
* **Herramientas habilitadas:**
  * `vscode`, `execute`, `read`, `agent`, `edit`, `search`, `web`, `todo`
