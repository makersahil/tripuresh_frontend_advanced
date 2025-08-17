type Variant = "info" | "success" | "warning" | "error";

const styles: Record<Variant, string> = {
  info: "bg-blue-50 text-blue-800 border-blue-200",
  success: "bg-green-50 text-green-800 border-green-200",
  warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
  error: "bg-red-50 text-red-800 border-red-200",
};

export default function InlineAlert({
  children,
  variant = "info",
}: {
  children: React.ReactNode;
  variant?: Variant;
}) {
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles[variant]}`}>
      {children}
    </div>
  );
}
