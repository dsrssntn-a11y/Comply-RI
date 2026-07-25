import { COPY } from "../data/copy";

export default function Hero() {
  return (
    <section className="hero-strip">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-2.5">
        {/* Matches the header's icon width (w-7) + gap so this text lines up
            with the header's h1, which is indented past the RhodeIslandMark icon. */}
        <div className="w-7 shrink-0" aria-hidden="true" />
        <div>
          <p className="hero-statement">{COPY.heroStatement}</p>
          <p className="civic-trust">{COPY.civicTrustLine}</p>
        </div>
      </div>
    </section>
  );
}
