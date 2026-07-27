import { useState } from "react";
import { formatTons, generateShareText } from "../lib/formatters";
import { copyToClipboard } from "../lib/clipboard";
import { COPY } from "../data/copy";

interface ImpactCalloutProps {
  tonnage: number;
  shareable?: boolean;
}

function LeafSparkleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="leaf-pop-animation"
    >
      <path
        d="M22 8C15 8 9 14 9 21C9 22.5 10.5 23 12 23C19 23 24 17 24 10C24 9 23.5 8 22 8Z"
        fill="#22C55E"
      />
      <path
        d="M11.5 21C15 17 18 13.5 21.5 9.5"
        stroke="#15803D"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M25 4L26.2 5.8L28 7L26.2 8.2L25 10L23.8 8.2L22 7L23.8 5.8Z" fill="#D4A62A" />
    </svg>
  );
}

export default function ImpactCallout({ tonnage, shareable }: ImpactCalloutProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareText = generateShareText(tonnage, window.location.href);

    // Always populate the clipboard first, regardless of share method. Some
    // native share targets (e.g. LinkedIn) ignore the shared text/title and
    // only use the URL, generating their own preview from page metadata —
    // this guarantees the full statement is still pasteable manually.
    const copiedOk = await copyToClipboard(shareText);

    if (navigator.share) {
      try {
        await navigator.share({ title: COPY.toolName, text: shareText, url: window.location.href });
      } catch {
        // User cancelled share — do nothing further
      }
    }

    if (copiedOk) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div className="text-center py-1">
      <p className="text-4xl sm:text-5xl font-bold text-harbor-blue tabular-nums">
        {formatTons(tonnage)}
      </p>
      <p className="text-sm text-fog-gray mt-1 max-w-sm mx-auto">
        If this entity complies with the RI food waste ban, an estimated {formatTons(tonnage)} of
        organic waste will be diverted from landfill annually.{" "}
        {shareable ? (
          <button
            type="button"
            onClick={handleShare}
            title={copied ? COPY.shareCopied : COPY.shareCommitment}
            aria-label={copied ? COPY.shareCopied : "Share your compliance commitment"}
            className="inline-flex items-center gap-1 align-middle ml-1.5 pl-1.5 pr-2.5 py-px rounded-full bg-sea-glass/10 hover:bg-sea-glass/20 border border-sea-glass/30 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50"
          >
            <LeafSparkleIcon />
            <span className="text-xs font-semibold text-sea-glass">
              {copied ? "Copied" : "Share"}
            </span>
          </button>
        ) : (
          <span className="inline-block align-text-bottom ml-1">
            <LeafSparkleIcon />
          </span>
        )}
      </p>
    </div>
  );
}
