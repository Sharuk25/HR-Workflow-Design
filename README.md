# HR Workflow Designer Module

This is a prototype implementation of an HR Workflow Designer, built using React, React Flow, and Zustand. It allows HR administrators to visually create, configure, and simulate internal workflows like onboarding processes, leave approvals, and more.

## Architecture

The project is structured with scalability and clear separation of concerns in mind:

- **State Management (`src/store/useWorkflowStore.ts`)**: We use Zustand for global state management. This avoids excessive prop drilling between the React Flow canvas, the sidebar, the properties panel, and the sandbox simulator. It manages nodes, edges, selection state, and node data updates in one centralized store.
- **Canvas (`src/components/canvas`)**: A React Flow wrapper. Responsible for rendering the nodes, edges, and managing drag-and-drop interactions. Custom node components are extracted cleanly into `#nodes` to keep the logic isolated.
- **Node Properties (`src/components/properties/PropertiesPanel.tsx`)**: A dynamic form component. It listens to the currently selected node from the global store, dynamically rendering inputs based on the node `type`. Updates push directly back to the store using a shared update handler (`updateNodeData`).
- **Sandbox (`src/components/sandbox/SandboxPanel.tsx`)**: The test runner. It pulls the current graph from the store, invokes the mock API simulation, and displays an execution trace.
- **API Simulation (`src/api/mockApi.ts`)**: Isolates "backend" behavior. Features simulated network delays and logic for traversing the flow graph, catching cycles, and asserting single-start-node constraints.

## Technology Choices

- **Vite & React**: Fast development server and sensible defaults for a modern SPA.
- **@xyflow/react**: Industry standard for building node-based graph UIs in React.
- **Zustand**: Lightweight and unopinionated relative to Redux, perfect for synchronous canvas state.
- **Tailwind CSS**: Rapid modular styling. Used `tailwind-merge` and `clsx` for dynamic component classes.
- **Lucide React**: Clean, consistent icon set.

## Extensibility / Scalability (What I'd add with more time)

1. **Robust Validation**: Visual cues on nodes themselves (e.g. red outlines or warning icons) when they are disconnected or missing required configuration.
2. **Advanced Graph Traversal**: The current mock simulation follows the first available edge at a split. A production app needs branch conditions (e.g. true/false paths out of an Approval node).
3. **Persistance**: Connect to a real database with Node/Edge persistence via UUIDs.
4. **Export / Import**: Serialize the workflow to JSON to save/load.
5. **Zoom & Mini-map Controls**: Provide better UX for enormous graphs (minimap is partially implemented).
6. **Undo / Redo Buffer**: Enhances editor usability.

## Running the App

Since this is bundled on AI Studio, standard environment:
1. Ensure dependencies are installed via \`npm install\`.
2. Run development server via \`npm run dev\`.
