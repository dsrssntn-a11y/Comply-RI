import { useEffect, useRef } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";

interface WaiverNoticeModalProps {
  open: boolean;
  onDismiss: () => void;
  onCheckWaiverPath: () => void;
}

export default function WaiverNoticeModal({
  open,
  onDismiss,
  onCheckWaiverPath,
}: WaiverNoticeModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-harbor-blue/40 px-4"
      onClick={onDismiss}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="waiver-notice-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-white rounded-xl shadow-lg max-w-sm w-full p-5"
      >
        <p id="waiver-notice-title" className="text-sm font-semibold text-harbor-blue mb-1.5">
          A separate waiver may be available
        </p>
        <p className="text-sm text-fog-gray mb-4">
          Entities in this category may qualify for a tipping-fee waiver under § 23-18.9-17(c),
          independent of the facility check above. See "How this was calculated" for details and
          the statutory source.
        </p>
        <div className="flex gap-2">
          <button
            ref={primaryButtonRef}
            type="button"
            onClick={onCheckWaiverPath}
            className="flex-1 rounded-lg bg-anchor-gold text-harbor-blue font-semibold text-sm py-2 hover:brightness-95 transition-[filter] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-harbor-blue/60 focus-visible:ring-offset-2"
          >
            Check waiver path
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
