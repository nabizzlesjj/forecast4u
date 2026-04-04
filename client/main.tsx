import "./global.css";
// Carbon Design System global styles.
// We import via a local .scss bridge so Vite's sass preprocessor resolves
// the @use rule through node_modules rather than a raw pnpm path.
import "./carbon.scss";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
