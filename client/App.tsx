import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  Theme,
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
} from "@carbon/react";
import { Help } from "@carbon/icons-react";
import Index from "./pages/Index";
import Weather from "./pages/Weather";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ── Carbon Header with React Router navigation ────────────────────────────────

function CarbonHeader() {
  return (
    <Header aria-label="Forecast4U">
      <SkipToContent />

      {/* Brand */}
      <HeaderName
        // @ts-expect-error Carbon element prop accepts React Router Link
        element={Link}
        to="/"
        href="/"
        prefix=""
      >
        Forecast<span style={{ color: "#78a9ff" }}>4U</span>
      </HeaderName>

      {/* Primary nav */}
      <HeaderNavigation aria-label="Forecast4U primary navigation">
        <HeaderMenuItem
          // @ts-expect-error Carbon element prop accepts React Router Link
          element={Link}
          to="/"
          href="/"
        >
          Home
        </HeaderMenuItem>
        <HeaderMenuItem
          // @ts-expect-error Carbon element prop accepts React Router Link
          element={Link}
          to="/weather/10001"
          href="/weather/10001"
        >
          Example: NYC
        </HeaderMenuItem>
        <HeaderMenuItem
          // @ts-expect-error Carbon element prop accepts React Router Link
          element={Link}
          to="/weather/90210"
          href="/weather/90210"
        >
          Example: Beverly Hills
        </HeaderMenuItem>
      </HeaderNavigation>

      {/* Global action bar */}
      <HeaderGlobalBar>
        {/* Contact Support */}
        <HeaderGlobalAction
          aria-label="Contact Support"
          tooltipAlignment="end"
          // @ts-expect-error allow href on HeaderGlobalAction
          href="mailto:support@forecast4u.com"
        >
          <Help size={20} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </Header>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Theme theme="g10">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <CarbonHeader />
          {/* Carbon Header is position:fixed — offset main content by header height (3rem / 48px) */}
          <main style={{ paddingTop: "3rem" }}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/weather/:zip" element={<Weather />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </BrowserRouter>
      </QueryClientProvider>
    </Theme>
  );
}
