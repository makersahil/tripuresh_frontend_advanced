import { Input } from "@/components/ui/input";

type YearInputProps = {
  value: number | "" ;
  onChange: (val: number | "") => void;
  label?: string;
  min?: number;
  max?: number;
  required?: boolean;
  name?: string;
  placeholder?: string;
};

const currentYear = new Date().getFullYear();

export default function YearInput({
  value,
  onChange,
  label,
  min = 1900,
  max = currentYear + 5,
  required,
  name,
  placeholder = "Year",
}: YearInputProps) {
  return (
    <label className="grid gap-1">
      {label && <span className="text-sm font-medium">{label}{required && " *"}</span>}
      <Input
        type="number"
        name={name}
        inputMode="numeric"
        min={min}
        max={max}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") return onChange("");
          const n = Number(raw);
          if (Number.isNaN(n)) return;
          onChange(Math.max(min, Math.min(max, n)));
        }}
      />
      <span className="text-xs text-gray-500">{min}–{max}</span>
    </label>
  );
}
