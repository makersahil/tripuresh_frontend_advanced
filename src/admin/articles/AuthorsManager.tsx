type SimpleAuthor = { firstName: string; lastName: string };
export default function AuthorsManager({
  value,
  onChange
}: { value: SimpleAuthor[]; onChange: (next: SimpleAuthor[]) => void }) {
  function add() { onChange([...value, { firstName: "", lastName: "" }]); }
  function update(i: number, patch: Partial<SimpleAuthor>) {
    const next = value.slice(); next[i] = { ...next[i], ...patch }; onChange(next);
  }
  function remove(i: number) {
    const next = value.slice(); next.splice(i, 1); onChange(next);
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = value.slice();
    const tmp = next[i]; next[i] = next[j]; next[j] = tmp;
    onChange(next);
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Authors</h4>
        <button type="button" onClick={add} className="text-sm underline">Add author</button>
      </div>
      <div className="space-y-2">
        {value.map((a, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
            <input
              className="rounded-xl border px-2 py-1 text-sm"
              placeholder="First name"
              value={a.firstName}
              onChange={e => update(i, { firstName: e.target.value })}
            />
            <input
              className="rounded-xl border px-2 py-1 text-sm"
              placeholder="Last name"
              value={a.lastName}
              onChange={e => update(i, { lastName: e.target.value })}
            />
            <button type="button" onClick={() => move(i, -1)} className="text-xs px-2 py-1 border rounded-xl">↑</button>
            <button type="button" onClick={() => (value.length > 1 ? remove(i) : onChange([]))} className="text-xs px-2 py-1 border rounded-xl">✕</button>
          </div>
        ))}
        {value.length === 0 && (
          <p className="text-xs text-muted-foreground">No authors added yet.</p>
        )}
      </div>
    </div>
  );
}
