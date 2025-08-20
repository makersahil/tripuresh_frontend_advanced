import { useState } from "react";
import { Input } from "@/components/ui/input";

function isLikelyUrl(s: string) {
  if (!s) return true;
  try {
    // allow missing protocol by trying to add https:
    const url = new URL(s.startsWith("http") ? s : `https://${s}`);
    return !!url.hostname;
  } catch { return false; }
}

export default function UrlInput({
  value,
  onChange,
  label = "URL",
  name,
  placeholder = "https://example.com",
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const [touched, setTouched] = useState(false);
  const valid = isLikelyUrl(value);

  return (
    <label className="grid gap-1">
      <span className="text-sm font-medium">{label}{required && " *"}</span>
      <Input
        type="url"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
      />
      {!valid && touched && (
        <span className="text-xs text-red-600">Please enter a valid URL.</span>
      )}
    </label>
  );
}
