import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Button, InlineNotification, Theme } from "@carbon/react";

interface ZipSearchProps {
  initialZip?: string;
  size?: "default" | "large";
  variant?: "light" | "dark";
  placeholder?: string;
  /** Called with the valid ZIP just before navigation occurs. */
  onSearch?: (zip: string) => void;
}

export default function ZipSearch({
  initialZip = "",
  size = "default",
  variant = "light",
  placeholder = "Enter 5-digit ZIP code",
  onSearch,
}: ZipSearchProps) {
  const [zip, setZip] = useState(initialZip);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = (value: string): string => {
    if (!value) return "Please enter a ZIP code.";
    if (!/^\d{5}$/.test(value)) return "ZIP code must be exactly 5 digits.";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
    setZip(value);
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate(zip);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSearch?.(zip);
    navigate(`/weather/${zip}`);
  };

  // Map our size tokens to Carbon's size tokens
  const carbonSize = size === "large" ? "lg" : "md";

  // Map our variant to Carbon's theme token
  const carbonTheme = variant === "dark" ? "g90" : "g10";

  return (
    <Theme theme={carbonTheme}>
      <div>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <Search
                id="zip-search"
                size={carbonSize}
                labelText="ZIP code search"
                placeholder={placeholder}
                value={zip}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={5}
                aria-invalid={!!error}
                aria-describedby={error ? "zip-error" : undefined}
              />
            </div>
            <Button type="submit" size={carbonSize}>
              Search
            </Button>
          </div>

          {error && (
            <InlineNotification
              id="zip-error"
              kind="error"
              title={error}
              lowContrast
              role="alert"
              statusIconDescription="Error"
              hideCloseButton
            />
          )}
        </form>
      </div>
    </Theme>
  );
}
