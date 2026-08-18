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
    <div className="text-xs text-fog-gray leading-relaxed border-t border-mist-gray pt-3 space-y-2">
      <p>
        Facility and hauler data is maintained on a static basis and may not reflect the most
        current authorized facility list. Users are encouraged to verify current requirements and
        facility status directly with the Rhode Island Department of Environmental Management
        (RIDEM) at dem.ri.gov.
      </p>
      <p>
        Use RIDEM as the final authority for unresolved compliance questions. RIDEM lists the
        Office of Waste Management at 401-222-2797 for questions about permitted solid-waste
        management facilities, via the{" "}
        <a
          href="https://dem.ri.gov/environmental-protection-bureau/land-revitalization-and-sustainable-materials-management/solid-waste"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-bay-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
        >
          RIDEM solid waste contact site
        </a>
        . This is the appropriate verification path for facility authorization, status, and a
        statute-specific issue such as whether an alternative recycling pathway or waiver applies.
      </p>
    </div>
  );
}
