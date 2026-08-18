import { FACILITY_DATA_VERIFIED, HAULER_DIRECTORY_VERIFIED } from "../lib/constants";

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
        <p className="font-semibold text-slate-amber">
          Facility data last verified: {FACILITY_DATA_VERIFIED}
        </p>
        <p className="font-semibold text-slate-amber">
          Hauler directory last verified: {HAULER_DIRECTORY_VERIFIED}
        </p>
        <p>
          Notice outdated or incorrect facility or hauler information?{" "}
          <a
            href="mailto:Filomena.DaSilva@dem.ri.gov?subject=RhodeWaste%20Tool%20%E2%80%94%20Facility%2FHauler%20Data%20Correction"
            className="underline underline-offset-2 hover:text-bay-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
          >
            Report it to RIDEM
          </a>
          .
        </p>
        <p>© Daisiris Santana 2026</p>
      </div>
    </footer>
  );
}
