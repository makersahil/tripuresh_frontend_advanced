import { ReactNode, useEffect } from "react";
import clsx from "clsx";

type Size = "sm" | "md" | "lg" | "xl";
type Props = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: Size;                 // default: md
  bodyClassName?: string;      // optional extra classes for body
  fullOnMobile?: boolean;      // if true, modal uses full width on <sm
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "sm:max-w-sm md:max-w-md",
  md: "sm:max-w-md md:max-w-lg",
  lg: "sm:max-w-lg md:max-w-2xl",
  xl: "sm:max-w-xl md:max-w-3xl lg:max-w-4xl",
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  bodyClassName,
  fullOnMobile = true,
}: Props) {
  // lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onMouseDown={onBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Panel */}
      <div
        className={clsx(
          "relative z-10 w-full overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5",
          // responsive widths
          SIZE_CLASSES[size],
          // full width on mobile if desired
          fullOnMobile ? "max-w-full" : "max-w-[92vw]"
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Flex column so body can scroll independently */}
        <div className="flex max-h-[85vh] flex-col">
          {/* Header */}
          {(title || onClose) && (
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="text-base font-semibold">{title}</div>
              <button
                onClick={onClose}
                className="rounded-lg px-2 py-1 text-sm hover:bg-gray-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          )}

          {/* Body (scrollable) */}
          <div
            className={clsx(
              "min-h-0 overflow-y-auto px-4 py-4",
              bodyClassName
            )}
          >
            {children}
          </div>

          {/* Footer (sticky at bottom) */}
          {footer !== null && (
            <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
