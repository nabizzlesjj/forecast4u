import type { Preview } from "@storybook/react";

// ── Carbon Design System global styles ────────────────────────────────────────
// Importing via the local bridge SCSS file (same pattern used in the main app)
import "../src/carbon.scss";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      // Carbon g10 (light) and g100 (dark) presets
      default: "Carbon g10",
      values: [
        { name: "Carbon g10", value: "#f4f4f4" },
        { name: "Carbon g90", value: "#262626" },
        { name: "Carbon g100", value: "#161616" },
        { name: "White", value: "#ffffff" },
      ],
    },
  },
};

export default preview;
