import { HAULERS } from "../data/haulers";
import type { HaulerListing } from "../types";

function ContactLine({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const isMissing = value === "Not listed";
  return (
    <p className="text-sm">
      <span className="text-fog-gray">{label}: </span>
      {isMissing || !href ? (
        <span className={isMissing ? "text-fog-gray italic" : "text-fog-gray"}>{value}</span>
      ) : (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className="text-bay-blue hover:text-harbor-blue underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
        >
          {value}
        </a>
      )}
    </p>
  );
}

function HaulerCard({ hauler }: { hauler: HaulerListing }) {
  const phoneHref = /^\+?[\d\s().-]+$/.test(hauler.phone)
    ? `tel:${hauler.phone.replace(/[^\d+]/g, "")}`
    : undefined;
  const emailHref = hauler.email !== "Not listed" ? `mailto:${hauler.email}` : undefined;
  const websiteHref = hauler.website !== "Not listed" ? `https://${hauler.website}` : undefined;

  return (
    <div className="bg-surface-white border border-mist-gray rounded-xl p-4">
      <p className="text-harbor-blue font-semibold text-[15px]">{hauler.hauler_name}</p>
      <p className="text-sm text-fog-gray mt-1">{hauler.verified_service}</p>
      <p className="text-sm text-fog-gray mt-1">
        <span className="font-semibold text-harbor-blue">Service area: </span>
        {hauler.service_area}
      </p>

      <div className="mt-3 pt-3 border-t border-mist-gray space-y-1">
        <ContactLine label="Phone" value={hauler.phone} href={phoneHref} />
        <ContactLine label="Email" value={hauler.email} href={emailHref} />
        <ContactLine label="Address" value={hauler.address} />
        <ContactLine label="Website" value={hauler.website} href={websiteHref} external />
      </div>
    </div>
  );
}

export default function HaulerDirectory() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <h2 className="text-harbor-blue font-semibold text-lg">Hauler Directory</h2>
        <p className="text-sm text-fog-gray mt-0.5">
          A static, curated list of organics-capable haulers operating in Rhode Island — a service
          directory, not a legal determination.
        </p>
      </div>

      <div className="bg-surface-white border border-mist-gray rounded-xl p-4 space-y-2">
        <p className="text-sm text-fog-gray">
          This directory lists haulers verified to handle food waste organics in Rhode Island. It
          is provided as a reference only. This list does not constitute an endorsement.
        </p>
        <p className="text-sm font-semibold text-slate-amber bg-slate-amber/10 rounded-lg px-3 py-2">
          Contact haulers directly to confirm service area, capacity, and pricing.
        </p>
      </div>

      {HAULERS.length === 0 ? (
        <div className="bg-surface-white border border-mist-gray rounded-xl p-6 text-sm text-fog-gray">
          Hauler listings are pending RIRRC and RIFPC verification and will appear here once
          confirmed.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {HAULERS.map((hauler) => (
            <HaulerCard key={hauler.hauler_name} hauler={hauler} />
          ))}
        </div>
      )}
    </div>
  );
}
