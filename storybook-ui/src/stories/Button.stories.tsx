import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@carbon/react";
import { Add, ArrowRight, TrashCan } from "@carbon/icons-react";

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Button> = {
  title: "Carbon / Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The IBM Carbon `Button` component. Supports `primary`, `secondary`, `danger`, `ghost`, and `tertiary` kinds in four sizes (`sm`, `md`, `lg`, `xl`).",
      },
    },
  },
  argTypes: {
    kind: {
      control: "select",
      options: ["primary", "secondary", "danger", "ghost", "tertiary", "danger--ghost", "danger--tertiary"],
      description: "Visual style of the button",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl"],
      description: "Size of the button",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button",
    },
    children: {
      control: "text",
      description: "Button label text",
    },
  },
  args: {
    children: "Button",
    kind: "primary",
    size: "lg",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ── Stories ───────────────────────────────────────────────────────────────────

/** Default primary button — the most common action. */
export const Primary: Story = {
  args: { kind: "primary", children: "Primary" },
};

/** Secondary button for less prominent actions. */
export const Secondary: Story = {
  args: { kind: "secondary", children: "Secondary" },
};

/** Ghost button for low-emphasis actions or inline controls. */
export const Ghost: Story = {
  args: { kind: "ghost", children: "Ghost" },
};

/** Tertiary button — outlined style for moderate emphasis. */
export const Tertiary: Story = {
  args: { kind: "tertiary", children: "Tertiary" },
};

/** Danger button for destructive or irreversible actions. */
export const Danger: Story = {
  args: { kind: "danger", children: "Delete" },
};

/** Disabled state — applies to all kinds. */
export const Disabled: Story = {
  args: { kind: "primary", children: "Disabled", disabled: true },
};

/** Small size for compact UIs. */
export const Small: Story = {
  args: { kind: "primary", children: "Small", size: "sm" },
};

/** Button with a trailing Carbon icon. */
export const WithIcon: Story = {
  args: {
    kind: "primary",
    children: "Search Weather",
    renderIcon: ArrowRight,
  },
};

/** Icon-only button (ghost) — used for toolbar actions. */
export const IconOnly: Story = {
  args: {
    kind: "ghost",
    hasIconOnly: true,
    renderIcon: Add,
    iconDescription: "Add item",
    tooltipAlignment: "center",
  },
};

/** Danger icon-only — e.g. a delete action in a table row. */
export const DangerIconOnly: Story = {
  args: {
    kind: "danger--ghost",
    hasIconOnly: true,
    renderIcon: TrashCan,
    iconDescription: "Delete item",
    tooltipAlignment: "center",
  },
};

/** All five core kinds side-by-side for quick comparison. */
export const AllKinds: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", padding: "1rem" }}>
      <Button kind="primary">Primary</Button>
      <Button kind="secondary">Secondary</Button>
      <Button kind="tertiary">Tertiary</Button>
      <Button kind="ghost">Ghost</Button>
      <Button kind="danger">Danger</Button>
    </div>
  ),
};

/** All four sizes for the primary kind. */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem", padding: "1rem" }}>
      <Button kind="primary" size="sm">Small</Button>
      <Button kind="primary" size="md">Medium</Button>
      <Button kind="primary" size="lg">Large</Button>
      <Button kind="primary" size="xl">Extra Large</Button>
    </div>
  ),
};

/** Forecast4U-themed buttons showing the app's usage of Carbon Button. */
export const Forecast4UUsage: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", padding: "1rem" }}>
      <Button kind="primary" renderIcon={ArrowRight}>
        View Forecast
      </Button>
      <Button kind="ghost">Try Another ZIP</Button>
      <Button kind="danger--ghost" renderIcon={TrashCan} hasIconOnly iconDescription="Remove from recent" />
    </div>
  ),
};
