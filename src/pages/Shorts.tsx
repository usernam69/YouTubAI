import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VIDEOS } from "../data/videos";
import { useLibrary, useLibraryActions } from "../lib/library";
import { fmt } from "../lib/fmt";

/**
 * Shorts — a vertical, snap-scrolling feed.
 * Films are cropped to 9:16 by the browser (object-fit: cover); the shortest
 * open movies in the catalogue make the best loop material.
 */
export default function Shorts() {
  const nav = useNavigate();
  const lib = useLibrary();
  const { toggleIn, saveProgress } = useLibraryActions();

  const reel = useMemo(() => [...VIDEOS].sort((a, b) => a.seconds - b.seconds).slice(0, 8), []);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const [muted, setMuted] = useState(true);
  const [activeId, setActiveId] = useState(reel[0]?.id ?? 0);

  /* Only the visible clip plays */
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          const id = Number((e.target as HTMLElement).dataset.vid);
          const el = videoRefs.current[id];
          if (!el) continue;
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            setActiveId(id);
            el.play().catch(() => {});
          } else {
            el.pause();
            if (el.currentTime > 1) saveProgress(id, el.currentTime, el.duration || 0);
          }
        }
      },
      { root, threshold: [0, 0.6, 1] }
    );
    for (const el of Object.values(videoRefs.current)) {
      if (el?.parentElement) io.observe(el.parentElement);
    }
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reel]);

  useEffect(() => {
    for (const [id, el] of Object.entries(videoRefs.current)) {
      if (el) el.muted = muted;
      void id;
    }
  }, [muted]);

  if (reel.length === 0) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", width: "100%", maxWidth: 460 }}>
        <div
          ref={scrollerRef}
          style={{
            height: "calc(100vh - 100px)",
            overflowY: "auto",
            scrollSnapType: "y mandatory",
            borderRadius: 18,
            scrollbarWidth: "none",
            background: "#000",
          }}
        >
          {reel.map(v => {
            const liked = lib.liked.includes(v.id);
            const saved = lib.watchLater.includes(v.id);
            return (
              <div
                key={v.id}
                data-vid={v.id}
                style={{
                  height: "100%",
                  scrollSnapAlign: "start",
                  position: "relative",
                  display: "grid",
                  placeItems: "center",
                  background: "#000",
                }}
              >
                <video
                  ref={el => {
                    videoRefs.current[v.id] = el;
                  }}
                  src={v.src}
                  poster={v.poster}
                  muted={muted}
                  loop
                  playsInline
                  preload="none"
                  onClick={() => nav(`/watch/${v.slug}`)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 18,
                    cursor: "pointer",
                    background: "#000",
                  }}
                />

                {/* top scrim */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 96,
                    background: "linear-gradient(rgba(0,0,0,.7), transparent)",
                    borderRadius: "18px 18px 0 0",
                    pointerEvents: "none",
                  }}
                />

                <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 8, alignItems: "center" }}>
                  <span className="yt-livebadge" style={{ background: "#ff0033" }}>SHORTS</span>
                  <span style={{ fontSize: 12, color: "#e8e8e8", fontWeight: 600, textShadow: "0 1px 6px #000" }}>
                    {v.studio}
                  </span>
                </div>

                <button
                  className="yt-iconbtn"
                  aria-label={muted ? "Unmute" : "Mute"}
                  onClick={() => setMuted(m => !m)}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "rgba(0,0,0,.55)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  {muted ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M4 9.5h3.5L13 5v14L7.5 14.5H4z" />
                      <path d="m17 9.5 4 5M21 9.5l-4 5" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M4 9.5h3.5L13 5v14L7.5 14.5H4z" />
                      <path d="M17 9a4 4 0 0 1 0 6M19.5 6.5a7.5 7.5 0 0 1 0 11" />
                    </svg>
                  )}
                </button>

                {/* bottom scrim + copy */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: "52px 14px 16px",
                    background: "linear-gradient(transparent, rgba(0,0,0,.86))",
                    borderRadius: "0 0 18px 18px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: v.accent,
                        color: "#0b0b0b",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 800,
                        fontSize: 10,
                        flexShrink: 0,
                      }}
                    >
                      {v.avatar}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, textShadow: "0 1px 6px #000" }}>{v.channel}</span>
                    <button
                      className={lib.subs.includes(v.channelSlug) ? "yt-btn yt-btn-ghost" : "yt-btn"}
                      style={{ height: 28, fontSize: 12, marginLeft: 4, padding: "0 12px" }}
                      onClick={() => toggleIn("subs", v.channelSlug)}
                    >
                      {lib.subs.includes(v.channelSlug) ? "Subscribed" : "Subscribe"}
                    </button>
                  </div>

                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 9, lineHeight: 1.35, textShadow: "0 1px 8px #000" }}>
                    {v.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#cfcfcf", marginTop: 3, textShadow: "0 1px 6px #000" }}>
                    {fmt(v.seconds)} · {v.cat} · {v.year} · {v.license}
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button className={liked ? "yt-btn yt-btn-on" : "yt-btn"} style={{ height: 30, fontSize: 12 }} onClick={() => toggleIn("liked", v.id)}>
                      👍 {liked ? "Liked" : "Like"}
                    </button>
                    <button className={saved ? "yt-btn yt-btn-on" : "yt-btn"} style={{ height: 30, fontSize: 12 }} onClick={() => toggleIn("watchLater", v.id)}>
                      {saved ? "✓ Saved" : "Save"}
                    </button>
                    <button className="yt-btn" style={{ height: 30, fontSize: 12 }} onClick={() => nav(`/watch/${v.slug}`)}>
                      Full film →
                    </button>
                  </div>
                </div>

                {activeId === v.id && <span style={{ position: "absolute", width: 0, height: 0 }} aria-hidden />}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", color: "#8f8f8f", fontSize: 12, marginTop: 10 }}>
          Scroll for more · muted by default · every clip is public domain or Creative Commons
        </div>
      </div>
    </div>
  );
}