interface DisclaimerProps {
  variant: "entry" | "output";
}

export default function Disclaimer({ variant }: DisclaimerProps) {
  if (variant === "entry") {
    return (
      <div className="text-xs text-fog-gray leading-relaxed space-y-2">
        <p>
          Your inputs are used only to calculate your compliance status and are not stored or
          saved. Nothing is transmitted anywhere unless you opt into the exact-address feature —
          see the note next to that field for details. All inputs are session-only and are cleared
          when the session ends.
        </p>
        <p>
          This tool is for informational purposes only, does not constitute legal advice, and
          should not be relied upon as a determination of compliance. For official guidance,
          contact RIDEM directly.
        </p>
      </div>
    );
  }

  return (
    <div className="text-xs text-fog-gray leading-relaxed border-t border-mist-gray pt-3">
      <p>
        Facility and hauler data is maintained on a static basis and may not reflect the most
        current authorized facility list. Users are encouraged to verify current requirements and
        facility status directly with the Rhode Island Department of Environmental Management
        (RIDEM) at dem.ri.gov.
      </p>
    </div>
  );
}
