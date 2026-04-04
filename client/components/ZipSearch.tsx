import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, AlertCircle } from "lucide-react";

interface ZipSearchProps {
  initialZip?: string;
  size?: "default" | "large";
  variant?: "light" | "dark";
  placeholder?: string;
}

export default function ZipSearch({
  initialZip = "",
  size = "default",
  variant = "light",
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
  const isDark = variant === "dark";

  const inputClass = isDark
    ? `w-full outline-none transition-all font-mono bg-transparent text-white placeholder-white/30
       border-b-2 border-white/20 focus:border-carbon-blue-40
       ${isLarge ? "pl-12 pr-4 py-4 text-2xl" : "pl-9 pr-4 py-2 text-sm"}
       ${error ? "border-red-400/60" : ""}`
    : `w-full bg-carbon-gray-10 border-b-2 outline-none transition-colors
       font-mono placeholder-carbon-gray-40 text-carbon-gray-100
       ${isLarge
         ? "pl-12 pr-4 py-4 text-2xl border-carbon-gray-50 focus:border-carbon-blue-60"
         : "pl-9 pr-4 py-2 text-sm border-carbon-gray-50 focus:border-carbon-blue-60"
       }
       ${error ? "border-red-500" : ""}`;

  const wrapperClass = isDark
    ? "bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
    : "";

  const iconClass = isDark ? "text-white/30" : "text-carbon-gray-50";

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} noValidate>
        <div className={`flex ${wrapperClass}`}>
          <div className="relative flex-1">
            <Search
              size={isLarge ? 20 : 16}
              className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${iconClass}`}
            />
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
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className={`
              font-medium transition-colors flex items-center gap-2 flex-shrink-0
              ${isDark
                ? `bg-carbon-blue-60 hover:bg-carbon-blue-70 text-white
                   ${isLarge ? "px-8 py-4 text-base" : "px-5 py-2 text-sm"}`
                : `bg-carbon-blue-60 text-white hover:bg-carbon-blue-70 active:bg-carbon-blue-80
                   ${isLarge ? "px-8 py-4 text-base" : "px-4 py-2 text-sm"}`
              }
            `}
          >
            {isLarge && <Search size={18} />}
            <span>Search</span>
          </button>
        </div>

        {error && (
          <div
            id="zip-error"
            role="alert"
            className={`flex items-center gap-2 mt-2 text-xs ${isDark ? "text-red-400" : "text-red-600"}`}
          >
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}
