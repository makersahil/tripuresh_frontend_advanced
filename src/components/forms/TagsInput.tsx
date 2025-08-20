import { useRef, useState } from "react";
import { X } from "lucide-react";

export default function TagsInput({
  value,
  onChange,
  label = "Tags",
  placeholder = "Type a tag and press Enter",
  name,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  label?: string;
  placeholder?: string;
  name?: string;
}) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function add(tag: string) {
    const clean = tag.trim();
    if (!clean) return;
    if (value.includes(clean)) return;
    onChange([...value, clean]);
    setDraft("");
  }

  function remove(tag: string) {
    onChange(value.filter(t => t !== tag));
  }

  return (
    <label className="grid gap-1">
      <span className="text-sm font-medium">{label}</span>
      <div className="rounded-2xl border bg-white p-2">
        <div className="flex flex-wrap gap-2">
          {value.map(t => (
            <span key={t} className="inline-flex items-center gap-1 rounded-xl bg-gray-100 px-2 py-1 text-xs">
              {t}
              <button
                type="button"
                onClick={() => remove(t)}
                className="hover:text-red-600"
                aria-label={`Remove ${t}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            name={name}
            className="flex-1 min-w-[12ch] outline-none text-sm placeholder:text-gray-400"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                add(draft);
              } else if (e.key === "Backspace" && draft === "" && value.length) {
                remove(value[value.length - 1]);
              }
            }}
          />
        </div>
      </div>
    </label>
  );
}
