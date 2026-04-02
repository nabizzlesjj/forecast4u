import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, AlertCircle } from "lucide-react";

interface ZipSearchProps {
  initialZip?: string;
  size?: "default" | "large";
  placeholder?: string;
}

export default function ZipSearch({
  initialZip = "",
  size = "default",
  placeholder = "Enter 5-digit ZIP code",
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
    navigate(`/weather/${zip}`);
  };

  const isLarge = size === "large";

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} noValidate>
        <div className={`flex ${isLarge ? "flex-col sm:flex-row" : ""} gap-0`}>
          {/* Label */}
          {isLarge && (
            <div className="mb-2 sm:mb-0">
              <p className="text-xs text-carbon-gray-60 uppercase tracking-widest font-medium mb-1">
                Location
              </p>
            </div>
          )}

          <div className="flex flex-1">
            {/* Input wrapper */}
            <div className="relative flex-1">
              {isLarge ? (
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-gray-50 pointer-events-none"
                />
              ) : (
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-carbon-gray-50 pointer-events-none"
                />
              )}
              <input
                id="zip-search"
                type="text"
                inputMode="numeric"
                value={zip}
                onChange={handleChange}
                placeholder={placeholder}
                maxLength={5}
                aria-label="ZIP code search"
                aria-invalid={!!error}
                aria-describedby={error ? "zip-error" : undefined}
                className={`
                  w-full bg-carbon-gray-10 border-b-2 outline-none transition-colors
                  font-mono placeholder-carbon-gray-40 text-carbon-gray-100
                  ${isLarge
                    ? "pl-12 pr-4 py-4 text-2xl border-carbon-gray-50 focus:border-carbon-blue-60"
                    : "pl-9 pr-4 py-2 text-sm border-carbon-gray-50 focus:border-carbon-blue-60"
                  }
                  ${error ? "border-red-500" : ""}
                `}
              />
            </div>

            {/* Search button */}
            <button
              type="submit"
              className={`
                bg-carbon-blue-60 text-white font-medium hover:bg-carbon-blue-70 
                active:bg-carbon-blue-80 transition-colors flex items-center gap-2
                flex-shrink-0
                ${isLarge ? "px-8 py-4 text-base" : "px-4 py-2 text-sm"}
              `}
            >
              {isLarge && <Search size={18} />}
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            id="zip-error"
            role="alert"
            className="flex items-center gap-2 mt-2 text-red-600 text-xs"
          >
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}
