import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { VIDEOS } from "../data/videos";
import { VideoCard } from "../components/VideoCard";
import { useLibrary, useLibraryActions } from "../lib/library";
import { fmt } from "../lib/fmt";

type Kind = "history" | "watchlater" | "liked" | "playlists";

const COPY: Record<Kind, { title: string; sub: string; empty: string }> = {
  history: {
    title: "Watch history",
    sub: "Everything you opened, newest first. Stored on this device only.",
    empty: "Nothing watched yet. Open any film and it will show up here.",
  },
  watchlater: {
    title: "Watch later",
    sub: "Films you saved for later.",
    empty: "Tap Save on any film to queue it here.",
  },
  liked: {
    title: "Liked videos",
    sub: "The ones you gave a thumbs up.",
    empty: "No likes yet. Hit Like on something worth it.",
  },
  playlists: {
    title: "Playlists",
    sub: "Grouped by genre from what you saved and liked.",
    empty: "Save or like a few films and a playlist appears here.",
  },
};

export default function Library({ kind }: { kind: Kind }) {
  const nav = useNavigate();
  const lib = useLibrary();
  const { reset, toggleIn } = useLibraryActions();

  const items = useMemo(() => {
    const ids =
      kind === "history" ? lib.history : kind === "watchlater" ? lib.watchLater : kind === "liked" ? lib.liked : [...lib.watchLater, ...lib.liked.filter(id => !lib.watchLater.includes(id))];
    return ids.map(id => VIDEOS.find(v => v.id === id)).filter((v): v is (typeof VIDEOS)[number] => Boolean(v));
  }, [kind, lib.history, lib.watchLater, lib.liked]);

  const totalSeconds = items.reduce((n, v) => n + v.seconds, 0);
  const copy = COPY[kind];

  const smartPlaylists = useMemo(() => {
    const cats = new Map<string, number[]>();
    for (const id of [...lib.watchLater, ...lib.liked]) {
      const v = VIDEOS.find(x => x.id === id);
      if (!v) continue;
      cats.set(v.cat, [...(cats.get(v.cat) ?? []), v.id]);
    }
    return Array.from(cats.entries()).filter(([, ids]) => ids.length > 1);
  }, [lib.watchLater, lib.liked]);

  if (kind === "playlists") {
    return (
      <div style={{ maxWidth: 1200 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>{copy.title}</h1>
        <p style={{ color: "#9a9a9a", fontSize: 13.5, marginTop: 6, marginBottom: 22 }}>{copy.sub}</p>

        {smartPlaylists.length === 0 ? (
          <EmptyState text={copy.empty} onBrowse={() => nav("/")} />
        ) : (
          <div className="yt-grid">
            {smartPlaylists.map(([cat, ids]) => (
              <div key={cat} className="yt-card" style={{ cursor: "pointer" }} onClick={() => nav(`/?cat=${encodeURIComponent(cat)}`)}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, borderRadius: 10, overflow: "hidden" }}>
                  {ids.slice(0, 4).map((id, i) => {
                    const v = VIDEOS.find(x => x.id === id)!;
                    return <img key={`${id}-${i}`} src={v.poster} alt="" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />;
                  })}
                </div>
                <div style={{ fontWeight: 700, marginTop: 10, fontSize: 15 }}>{cat}</div>
                <div style={{ color: "#aaa", fontSize: 12.5, marginTop: 2 }}>
                  {ids.length} videos · {fmt(ids.reduce((n, id) => n + (VIDEOS.find(v => v.id === id)?.seconds ?? 0), 0))} total
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>{copy.title}</h1>
          <p style={{ color: "#9a9a9a", fontSize: 13.5, marginTop: 6 }}>{copy.sub}</p>
        </div>
        {items.length > 0 && (
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span className="yt-tag" style={{ fontSize: 12 }}>
              {items.length} videos · {fmt(totalSeconds)} runtime
            </span>
            {kind === "watchlater" && (
              <button
                className="yt-btn"
                onClick={() => {
                  for (const v of items) if (lib.watchLater.includes(v.id)) toggleIn("watchLater", v.id);
                }}
              >
                Clear all
              </button>
            )}
            {kind === "history" && (
              <button className="yt-btn" onClick={reset}>Clear history</button>
            )}
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState text={copy.empty} onBrowse={() => nav("/")} />
      ) : kind === "history" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 22 }}>
          {items.map(v => {
            const p = lib.progress[v.id];
            return (
              <div key={v.id} style={{ display: "flex", gap: 16, alignItems: "center", padding: 8, borderRadius: 12 }} className="yt-hover">
                <button
                  onClick={() => nav(`/watch/${v.slug}`)}
                  style={{ display: "flex", gap: 16, alignItems: "center", flex: 1, minWidth: 0, background: "none", border: "none", color: "inherit", textAlign: "left" }}
                >
                  <img src={v.poster} alt="" style={{ width: 210, borderRadius: 10, aspectRatio: "16/9", objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14.5 }}>{v.title}</div>
                    <div style={{ color: "#aaa", fontSize: 12.5, marginTop: 3 }}>{v.channel} · {v.views} views</div>
                    {p && p.seconds > 5 && (
                      <div style={{ marginTop: 7 }}>
                        <div style={{ height: 3, width: 180, background: "#333", borderRadius: 2 }}>
                          <div style={{ height: "100%", width: `${Math.min(100, (p.seconds / p.dur) * 100)}%`, background: "#ff0033", borderRadius: 2 }} />
                        </div>
                        <div style={{ color: "#8f8f8f", fontSize: 11.5, marginTop: 4 }}>
                          {Math.floor(p.seconds / 60)}:{String(Math.floor(p.seconds % 60)).padStart(2, "0")} of {v.dur} · {fmt(Math.max(0, p.dur - p.seconds))} left
                        </div>
                      </div>
                    )}
                  </div>
                </button>
                <button className="yt-linkbtn" style={{ color: "#8f8f8f", flexShrink: 0 }} onClick={() => toggleIn("watchLater", v.id)}>
                  {lib.watchLater.includes(v.id) ? "Saved" : "Save"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="yt-grid" style={{ marginTop: 22 }}>
          {items.map(v => <VideoCard key={v.id} v={v} />)}
        </div>
      )}
    </div>
  );
}

function EmptyState({ text, onBrowse }: { text: string; onBrowse: () => void }) {
  return (
    <div className="yt-card" style={{ marginTop: 26, padding: 48, textAlign: "center" }}>
      <div style={{ fontSize: 34, marginBottom: 10, opacity: 0.5 }}>▢</div>
      <div style={{ fontWeight: 600, fontSize: 15 }}>Nothing here yet</div>
      <div style={{ color: "#9a9a9a", fontSize: 13.5, marginTop: 6, maxWidth: 420, marginInline: "auto", lineHeight: 1.55 }}>{text}</div>
      <button className="yt-btn yt-btn-primary" style={{ marginTop: 16 }} onClick={onBrowse}>Browse the catalogue</button>
    </div>
  );
}