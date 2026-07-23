interface DisclaimerProps {
  variant: "entry" | "output";
}

export default function Disclaimer({ variant }: DisclaimerProps) {
  if (variant === "entry") {
    return (
      <p className="text-xs text-fog-gray leading-relaxed">
        Your inputs are used only to calculate your compliance status and are not stored, saved,
        or transmitted. This tool is for informational purposes only and does not constitute legal
        advice. For official guidance, contact RIDEM directly.
      </p>
    );
  }

  return (
    <div className="text-xs text-fog-gray leading-relaxed space-y-2 border-t border-mist-gray pt-3">
      <p>
        This tool provides general information based on Rhode Island General Law
        § 23-18.9-17 and publicly available facility and service provider data. Results are
        intended to help entities understand their potential obligations under the RI Commercial
        Food Waste Ban — they do not constitute legal advice and should not be relied upon as a
        determination of compliance.
      </p>
      <p>
        Facility and hauler data is maintained on a static basis and may not reflect the most
        current authorized facility list. Users are encouraged to verify current requirements and
        facility status directly with the Rhode Island Department of Environmental Management
        (RIDEM) at dem.ri.gov.
      </p>
      <p>
        No user data is collected, stored, or transmitted. All inputs are session-only and are
        cleared when the session ends.
      </p>
    </div>
  );
}
