interface HowItWorksProps {
  open: boolean;
  onClose: () => void;
}

export default function HowItWorks({ open, onClose }: HowItWorksProps) {
  if (!open) return null;

  return (
    <div className="max-w-[640px] mx-auto mb-6 bg-surface-white border border-mist-gray rounded-xl p-5 text-sm text-fog-gray">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-harbor-blue text-sm">How this was calculated</span>
        <button
          type="button"
          onClick={onClose}
          className="text-fog-gray hover:text-harbor-blue text-xs underline underline-offset-2"
        >
          Close
        </button>
      </div>
      <p>Full explanation of the unit conversion, threshold rule, and statutory source is coming in a later build step.</p>
    </div>
  );
}
