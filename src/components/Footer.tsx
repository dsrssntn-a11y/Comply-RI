export default function Footer() {
  return (
    <footer className="print:hidden border-t border-mist-gray mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-xs text-fog-gray space-y-2">
        <p>
          This tool provides general information only and does not constitute legal advice. It is
          not a determination of compliance. For official guidance, contact RIDEM directly. This
          tool is provided "as is," without warranties of any kind, and use of it or reliance on
          its results is at your own risk.
        </p>
        <p>
          Sources: R.I. Gen. Laws § 23-18.9-17 · Rhode Island Department of Environmental
          Management (RIDEM) · Rhode Island Resource Recovery Corporation (RIRRC)
        </p>
        <p className="font-semibold text-slate-amber">
          This is an independent project, not officially affiliated with or endorsed by RIDEM.
        </p>
        <p className="font-semibold text-slate-amber">Facility data last verified: August 2026</p>
        <p className="font-semibold text-slate-amber">Hauler directory last verified: July 2026</p>
      </div>
    </footer>
  );
}
