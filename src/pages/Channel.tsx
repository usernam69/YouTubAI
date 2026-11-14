import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CHANNELS, VIDEOS } from "../data/videos";
import { VideoCard } from "../components/VideoCard";
import { useLibrary, useLibraryActions } from "../lib/library";

export default function Channel({ slug }: { slug: string }) {
  const nav = useNavigate();
  const lib = useLibrary();
  const { toggleIn } = useLibraryActions();
  const ch = CHANNELS.find(c => c.slug === slug);

  const films = useMemo(() => VIDEOS.filter(v => v.channelSlug === slug), [slug]);

  if (!ch) {
    return (
      <div className="yt-card" style={{ padding: 40, textAlign: "center", maxWidth: 700 }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Channel not found</div>
        <div style={{ color: "#aaa", fontSize: 13.5, marginTop: 6 }}>Every channel here is an open-movie studio.</div>
        <button className="yt-btn yt-btn-primary" style={{ marginTop: 14 }} onClick={() => nav("/")}>Back to home</button>
      </div>
    );
  }

  const subbed = lib.subs.includes(ch.slug);
  const totalViews = films.reduce((n, v) => n + parseInt(v.views, 10) * 1_000_000, 0);

  return (
    <div style={{ maxWidth: 1400 }}>
      <div
        style={{
          height: 148,
          borderRadius: 16,
          background: `linear-gradient(115deg, ${ch.accent} 0%, #1b1b1b 62%, #101010 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 140% at 12% 0%, rgba(255,255,255,.22), transparent 60%)" }} />
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 18, marginTop: -34, paddingLeft: 8, flexWrap: "wrap" }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: ch.accent,
            color: "#0f0f0f",
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            fontSize: 30,
            border: "4px solid #0f0f0f",
            flexShrink: 0,
          }}
        >
          {ch.avatar}
        </div>
        <div style={{ paddingBottom: 6, minWidth: 0 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.02em", margin: 0 }}>{ch.name}</h1>
          <div style={{ color: "#aaa", fontSize: 13, marginTop: 4 }}>
            @{ch.slug} · {ch.count} {ch.count === 1 ? "film" : "films"} · {(totalViews / 1_000_000).toFixed(1)}M views
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 8, paddingBottom: 10 }}>
          <button
            className={subbed ? "yt-btn" : "yt-btn yt-btn-primary"}
            onClick={() => toggleIn("subs", ch.slug)}
            style={{ minWidth: 116 }}
          >
            {subbed ? "Subscribed" : "Subscribe"}
          </button>
        </div>
      </div>

      <div className="yt-chips" style={{ marginTop: 22, marginBottom: 16 }}>
        {Array.from(new Set(films.map(f => f.cat))).map(c => (
          <button key={c} className="yt-chip" onClick={() => nav(`/?cat=${encodeURIComponent(c)}`)}>{c}</button>
        ))}
      </div>

      <div className="yt-grid">
        {films.map(v => <VideoCard key={v.id} v={v} />)}
      </div>
    </div>
  );
}

export function Subscriptions() {
  const nav = useNavigate();
  const lib = useLibrary();
  const { toggleIn } = useLibraryActions();

  const subs = lib.subs.map(s => CHANNELS.find(c => c.slug === s)).filter((c): c is (typeof CHANNELS)[number] => Boolean(c));
  const feed = useMemo(() => {
    const ids = new Set(subs.map(s => s.slug));
    return VIDEOS.filter(v => ids.has(v.channelSlug)).sort((a, b) => b.year - a.year);
  }, [subs]);

  if (subs.length === 0) {
    return (
      <div style={{ maxWidth: 1000 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Subscriptions</h1>
        <p style={{ color: "#9a9a9a", fontSize: 13.5, marginTop: 6 }}>Subscribe to a studio to build your own feed.</p>
        <div className="yt-grid" style={{ marginTop: 22 }}>
          {CHANNELS.map(c => {
            const films = VIDEOS.filter(v => v.channelSlug === c.slug);
            return (
              <div key={c.slug} className="yt-card" style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: c.accent,
                    color: "#0f0f0f",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: 22,
                    margin: "0 auto 10px",
                  }}
                >
                  {c.avatar}
                </div>
                <div style={{ fontWeight: 700 }}>{c.name}</div>
                <div style={{ color: "#aaa", fontSize: 12.5, marginTop: 3 }}>{c.count} {c.count === 1 ? "film" : "films"}</div>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12 }}>
                  <button className="yt-btn yt-btn-primary" onClick={() => toggleIn("subs", c.slug)}>Subscribe</button>
                  <button className="yt-btn" onClick={() => nav(`/channel/${c.slug}`)}>
                    View
                    {films.length ? "" : ""}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1500 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }} className="yt-chips">
        {subs.map(s => (
          <div key={s.slug} style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => nav(`/channel/${s.slug}`)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "#1c1c1c", border: "none", color: "inherit", padding: "6px 12px 6px 6px", borderRadius: 999 }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: s.accent,
                  color: "#0f0f0f",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 800,
                  fontSize: 11,
                }}
              >
                {s.avatar}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</span>
            </button>
            <button className="yt-linkbtn" style={{ color: "#8f8f8f" }} onClick={() => toggleIn("subs", s.slug)}>✕</button>
          </div>
        ))}
      </div>

      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Latest from your studios</h1>
      <div className="yt-grid">
        {feed.map(v => <VideoCard key={v.id} v={v} />)}
      </div>
    </div>
  );
}