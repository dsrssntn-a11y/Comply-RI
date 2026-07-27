export default function Footer() {
  return (
    <footer className="border-t border-mist-gray mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-xs text-fog-gray space-y-2">
        <p>
          This tool provides general information only and does not constitute legal advice. It is
          not a determination of compliance. For official guidance, contact RIDEM directly.
        </p>
        <p>
          Sources: R.I. Gen. Laws § 23-18.9-17 · Rhode Island Department of Environmental
          Management (RIDEM) · Rhode Island Resource Recovery Corporation (RIRRC)
        </p>
        <p className="font-semibold text-slate-amber">Facility data last verified: May 2026</p>
      </div>
    </footer>
  );
}
