# Forecast4U Weather Dashboard

A production-ready weather application built for the Forecast4U challenge, utilizing the IBM Carbon Design System, React Router 6, and Vitest.

## Tech Stack

- **UI Framework**: IBM Carbon Design System (`@carbon/react`)
- **Icons**: IBM Carbon Icons (`@carbon/icons-react`)
- **Styling**: Carbon Design Tokens and Carbon SASS (`@carbon/styles`)
- **Frontend**: React 18 + React Router 6 (SPA mode) + TypeScript + Vite
- **Testing**: Vitest + React Testing Library
- **Backend**: Express server (integrated with Vite dev server)

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (IBM Carbon Layouts)
├── components/           # Custom UI components using @carbon/react
├── App.tsx               # App entry and Carbon UI Shell setup
└── global.scss           # Carbon SASS imports and theme tokens

server/                   # Express API backend
├── index.ts              # Main server setup
└── routes/               # API handlers (Weather API integration)

shared/                   # Types shared by client & server
└── api.ts                # API interfaces (Weather data shapes)
```

## Key Features

### SPA Routing System
The routing system is powered by React Router 6:
- `client/pages/Index.tsx` represents the home page.
- `client/pages/Weather.tsx` handles dynamic routes for `/weather/:zip`.
- Routes are defined in `client/App.tsx`.

### IBM Carbon Styling
- **Primary**: IBM Carbon Design Tokens and `@carbon/react` component props.
- **Layout**: Use Carbon's 2x Grid system (`Grid`, `Row`, `Column`).
- **Typography**: Strictly follow IBM Plex Sans tokens.
- **Reference**: Index the [IBM Carbon Design System Documentation](https://carbondesignsystem.com/) for all UI decisions.

---

## Agent Rules & Automation

### 1. Mandatory Design System Rule (Requirement: Index & Apply)
The Builder.io agent MUST strictly adhere to the IBM Carbon Design System for all UI elements.
- **Indexing**: Before generating UI, the agent must reference Carbon component specs.
- **Application**: Always use `@carbon/react` components. 
    - Use `Search` or `TextInput` for ZIP input.
    - Use `InlineNotification` for all validation errors.
    - Use `Tag` (interactive) for the Search History list.
    - Use Carbon `UIShell` components for the header and navigation.
- **Theming**: Use the Carbon "White" or "G10" theme.

### 2. Mandatory Testing Rule (Requirement #6)
The Builder.io agent MUST automatically generate or update Vitest unit tests for every code change without user prompting.
- **Automation**: Include tests as part of the initial code generation for every task.
- **Location**: Co-locate tests with components (e.g., `SearchBar.spec.tsx`).
- **Coverage**: Must test ZIP validation logic, API success/failure states, and routing navigation.
- **Validation**: Ensure all code passes `pnpm test` before finalizing an update.

---

## Development Commands
```bash
pnpm dev        # Start dev server (Carbon UI + Express)
pnpm test       # Run Vitest suite (Requirement #6 verification)
pnpm build      # Production build
```