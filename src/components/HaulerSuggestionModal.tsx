import { useEffect, useRef } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";

interface HaulerSuggestionModalProps {
  open: boolean;
  onDismiss: () => void;
  onViewHaulers: () => void;
}

export default function HaulerSuggestionModal({
  open,
  onDismiss,
  onViewHaulers,
}: HaulerSuggestionModalProps) {
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return;
    primaryButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onDismiss();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div
      className="print:hidden fixed inset-0 z-50 flex items-center justify-center bg-harbor-blue/40 px-4"
      onClick={onDismiss}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hauler-suggestion-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-white rounded-xl shadow-lg max-w-sm w-full p-5"
      >
        <p id="hauler-suggestion-title" className="text-sm font-semibold text-harbor-blue mb-1.5">
          No facility within reach — but you can still divert
        </p>
        <p className="text-sm text-fog-gray mb-4">
          State law doesn't require this since no authorized facility is within 15 miles. A hauler
          can still bridge that distance gap, though, picking up your material and transporting
          it to one farther away. It's entirely voluntary, but every ton diverted still helps.
        </p>
        <div className="flex gap-2">
          <button
            ref={primaryButtonRef}
            type="button"
            onClick={onViewHaulers}
            className="flex-1 rounded-lg bg-anchor-gold text-harbor-blue font-semibold text-sm py-2 hover:brightness-95 transition-[filter] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-harbor-blue/60 focus-visible:ring-offset-2"
          >
            View Hauler Directory
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg border border-field-border text-fog-gray text-sm px-3 py-2 hover:text-harbor-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
