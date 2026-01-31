import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";

export interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onSubmit?: () => void;
  suggestions?: string[];
  onPickSuggestion?: (s: string) => void;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  onSubmit,
  suggestions = [],
  onPickSuggestion,
}: SearchBarProps) => {
  const { t } = useTranslation();
  const hasValue = value.trim().length > 0;
  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pr-8"
            onKeyDown={(e) => {
              if (e.key === "Enter" && onSubmit) onSubmit();
            }}
          />
          {hasValue && onClear && (
            <button
              type="button"
              aria-label={t("clear-search")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={onClear}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button variant="secondary" onClick={onSubmit}>
          <Search className="mr-2 h-4 w-4" />
          {t("search")}
        </Button>
      </div>

      {/* Real-time suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow">
          <ul className="max-h-56 overflow-auto">
            {suggestions.map((s) => (
              <li
                key={s}
                className="px-3 py-2 hover:bg-accent/20 cursor-pointer text-sm"
                onMouseDown={() => onPickSuggestion && onPickSuggestion(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
