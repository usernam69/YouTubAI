import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CATEGORIES, VIDEOS, type Video } from "../data/videos";
import { VideoCard } from "../components/VideoCard";
import { useLibrary } from "../lib/library";
import { fmt } from "../lib/fmt";

export default function Home() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const lib = useLibrary();
  const active = params.get("cat") ?? "All";
  const [heroIdx, setHeroIdx] = useState(0);

  const list = useMemo(
    () => (active === "All" ? VIDEOS : VIDEOS.filter(v => v.cat === active)),
    [active]
  );

  const hero = VIDEOS[heroIdx % 3];

  const resume = useMemo(() => {
    const rows: { v: Video; p: { seconds: number; dur: number; at: number } }[] = [];
    for (const [key, p] of Object.entries(lib.progress)) {
      if (!p || p.dur <= 0 || p.seconds <= 10 || p.seconds / p.dur >= 0.95) continue;
      const v = VIDEOS.find(x => x.id === Number(key));
      if (v) rows.push({ v, p });
    }
    return rows.sort((a, b) => b.p.at - a.p.at).slice(0, 6);
  }, [lib.progress]);

  const setCat = (c: string) => {
    if (c === "All") nav("/", { replace: true });
    else nav(`/?cat=${encodeURIComponent(c)}`, { replace: true });
  };

  return (
    <div style={{ maxWidth: 1600 }}>
      {/* ---------- hero ---------- */}
      <section
        className="yt-hero"
        style={{
          position: "relative",
          borderRadius: 18,
          overflow: "hidden",
          marginBottom: 22,
          background: "#141414",
        }}
      >
        <img
          key={hero.id}
          src={hero.poster}
          alt=""
          className="yt-hero-img"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(100deg, rgba(9,9,9,.96) 0%, rgba(9,9,9,.86) 38%, rgba(9,9,9,.35) 68%, rgba(9,9,9,.15) 100%)",
          }}
        />
        <div style={{ position: "relative", padding: "clamp(22px, 4vw, 52px)", maxWidth: 620 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <span className="yt-livebadge" style={{ background: "#ff0033" }}>OPEN CINEMA</span>
            <span style={{ fontSize: 12, color: "#c9c9c9", letterSpacing: ".04em", fontWeight: 600 }}>
              {hero.studio} · {hero.year} · {hero.license}
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(26px, 3.4vw, 44px)",
              lineHeight: 1.08,
              fontWeight: 800,
              letterSpacing: "-.025em",
              margin: 0,
            }}
          >
            {hero.title}
          </h1>
          <p style={{ color: "#c4c4c4", fontSize: 14.5, lineHeight: 1.6, margin: "12px 0 0", maxWidth: 520 }}>{hero.blurb}</p>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            <button className="yt-btn yt-btn-primary yt-btn-lg" onClick={() => nav(`/watch/${hero.slug}`)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5.14v13.72L19 12z" /></svg>
              Watch now
            </button>
            <button
              className="yt-btn yt-btn-lg"
              style={{ background: "rgba(255,255,255,.12)", backdropFilter: "blur(8px)" }}
              onClick={() => nav(`/watch/${hero.slug}`)}
            >
              {fmt(hero.seconds)} · {hero.cat}
            </button>
          </div>

          <div style={{ display: "flex", gap: 6, marginTop: 22 }}>
            {VIDEOS.slice(0, 3).map((x, i) => {
              const on = i === heroIdx % 3;
              return (
                <button
                  key={x.id}
                  aria-label={`Feature ${x.title}`}
                  aria-current={on}
                  onClick={() => setHeroIdx(i)}
                  style={{
                    height: 3,
                    width: on ? 26 : 12,
                    borderRadius: 2,
                    border: "none",
                    padding: 0,
                    background: on ? "#ff0033" : "rgba(255,255,255,.32)",
                    transition: "width .2s, background .2s",
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- continue watching ---------- */}
      {resume.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Keep watching</h2>
            <span style={{ fontSize: 12.5, color: "#8f8f8f" }}>picks up where you stopped</span>
          </div>
          <div className="yt-rail">
            {resume.map(({ v, p }) => (
              <div key={v.id} style={{ width: 268, flexShrink: 0 }}>
                <div className="yt-resumerail" onClick={() => nav(`/watch/${v.slug}`)}>
                  <VideoCard v={v} />
                  <div style={{ marginTop: 6, fontSize: 11.5, color: "#ff4d6d", fontWeight: 700 }}>
                    {fmt(Math.max(0, p.dur - p.seconds))} left
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- category chips ---------- */}
      <div className="yt-chips" style={{ marginBottom: 18 }}>
        {CATEGORIES.map(c => {
          const on = c === active;
          const n = c === "All" ? VIDEOS.length : VIDEOS.filter(v => v.cat === c).length;
          return (
            <button key={c} className={on ? "yt-chip yt-chip-on" : "yt-chip"} onClick={() => setCat(c)}>
              {c}
              <span style={{ opacity: 0.55, marginLeft: 6, fontSize: 11 }}>{n}</span>
            </button>
          );
        })}
      </div>

      {/* ---------- grid ---------- */}
      {list.length === 0 ? (
        <div className="yt-card" style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Nothing in {active} yet</div>
          <div style={{ color: "#aaa", fontSize: 13.5, marginTop: 6 }}>
            That is every film in the catalogue so far.
          </div>
          <button className="yt-btn yt-btn-primary" style={{ marginTop: 14 }} onClick={() => setCat("All")}>
            Show everything
          </button>
        </div>
      ) : (
        <div className="yt-grid">
          {list.map(v => (
            <VideoCard key={v.id} v={v} />
          ))}
        </div>
      )}
    </div>
  );
}