import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { VIDEOS, type Video } from "../data/videos";
import { Thumb } from "../components/VideoCard";
import { useLibrary, useLibraryActions } from "../lib/library";

function score(v: Video, q: string): number {
  const t = v.title.toLowerCase();
  const needle = q.toLowerCase();
  if (t === needle) return 100;
  if (t.startsWith(needle)) return 80;
  if (t.includes(needle)) return 60;
  if (v.tags.some(tag => tag.includes(needle))) return 45;
  if (v.cat.toLowerCase().includes(needle)) return 40;
  if (v.channel.toLowerCase().includes(needle)) return 35;
  if (v.studio.toLowerCase().includes(needle)) return 30;
  if (v.blurb.toLowerCase().includes(needle)) return 20;
  if (v.year.toString() === needle) return 25;
  /* every query token must land somewhere */
  const toks = needle.split(/\s+/).filter(Boolean);
  if (toks.length > 1 && toks.every(tk => `${v.title} ${v.cat} ${v.channel} ${v.tags.join(" ")} ${v.blurb}`.toLowerCase().includes(tk))) return 15;
  return 0;
}

export default function Search() {
  const [params, setParams] = useSearchParams();
  const nav = useNavigate();
  const lib = useLibrary();
  const { rememberSearch } = useLibraryActions();
  const q = params.get("q") ?? "";
  const [draft, setDraft] = useState(q);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(q);
  }, [q]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    return VIDEOS.map(v => ({ v, s: score(v, q.trim()) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map(x => x.v);
  }, [q]);

  const suggestions = useMemo(() => {
    if (!draft.trim()) return [];
    const d = draft.trim().toLowerCase();
    const titles = VIDEOS.filter(v => v.title.toLowerCase().includes(d) && v.title.toLowerCase() !== d).map(v => v.title);
    const tags = Array.from(new Set(VIDEOS.flatMap(v => v.tags))).filter(t => t.includes(d)).slice(0, 4);
    const cats = Array.from(new Set(VIDEOS.map(v => v.cat))).filter(c => c.toLowerCase().includes(d));
    return [...titles.slice(0, 4), ...cats.slice(0, 2), ...tags].slice(0, 7);
  }, [draft]);

  const submit = (term: string) => {
    const t = term.trim();
    if (!t) return;
    rememberSearch(t);
    nav(`/search?q=${encodeURIComponent(t)}`);
    inputRef.current?.blur();
  };

  if (!q.trim()) {
    return (
      <div style={{ maxWidth: 900 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Search</h1>
        <div className="yt-card" style={{ marginTop: 14 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              className="yt-input"
              placeholder="Search films, studios, tags…"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit(draft)}
            />
            <button className="yt-btn yt-btn-primary" onClick={() => submit(draft)}>Search</button>
          </div>

          {suggestions.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0" }}>
              {suggestions.map(s => (
                <li key={s}>
                  <button className="yt-suggest" onClick={() => submit(s)}>
                    <span style={{ color: "#888" }}>🔍</span> {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lib.searches.length > 0 && (
          <section style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700 }}>Recent searches</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              {lib.searches.map(s => (
                <button key={s} className="yt-chip" onClick={() => submit(s)}>{s}</button>
              ))}
            </div>
          </section>
        )}

        <section style={{ marginTop: 26 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>Browse everything</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {Array.from(new Set(VIDEOS.map(v => v.cat))).map(c => (
              <button key={c} className="yt-chip" onClick={() => submit(c)}>{c}</button>
            ))}
            {Array.from(new Set(VIDEOS.flatMap(v => v.tags))).slice(0, 12).map(t => (
              <button key={t} className="yt-chip" onClick={() => submit(t)}>#{t.replace(/\s+/g, "")}</button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          ref={inputRef}
          className="yt-input"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit(draft)}
        />
        <button className="yt-btn yt-btn-primary" onClick={() => submit(draft)}>Search</button>
      </div>

      <div style={{ color: "#9a9a9a", fontSize: 13, marginBottom: 16 }}>
        {results.length} {results.length === 1 ? "result" : "results"} for <strong style={{ color: "#eee" }}>“{q}”</strong>
        <button
          className="yt-linkbtn"
          style={{ marginLeft: 10, color: "#8f8f8f" }}
          onClick={() => { setParams({}); setDraft(""); }}
        >
          clear
        </button>
      </div>

      {results.length === 0 ? (
        <div className="yt-card" style={{ padding: 36, textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>No matches</div>
          <div style={{ color: "#aaa", fontSize: 13.5, marginTop: 6, lineHeight: 1.55 }}>
            Nothing matched “{q}”. Try a studio (Blender), a genre (horror), or a year (2010).
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {results.map(v => {
            const p = lib.progress[v.id];
            const unplayed = p && p.dur > 0 && p.seconds / p.dur < 0.95;
            return (
              <div key={v.id} className="yt-searchrow" onClick={() => nav(`/watch/${v.slug}`)}>
                <div style={{ position: "relative", width: 320, flexShrink: 0 }}>
                  <Thumb v={v} />
                  {unplayed && (
                    <>
                      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 3, background: "rgba(255,255,255,.28)" }}>
                        <div style={{ width: `${(p.seconds / p.dur) * 100}%`, height: "100%", background: "#ff0033" }} />
                      </div>
                    </>
                  )}
                </div>
                <div style={{ minWidth: 0, paddingTop: 2 }}>
                  <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.3 }}>{v.title}</div>
                  <div style={{ color: "#aaa", fontSize: 12.5, marginTop: 4 }}>
                    {v.views} views · {v.ago} · {v.license}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9 }}>
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: v.accent,
                        color: "#0f0f0f",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 9,
                        fontWeight: 800,
                      }}
                    >
                      {v.avatar}
                    </span>
                    <span style={{ color: "#bbb", fontSize: 12.5, fontWeight: 500 }}>{v.channel}</span>
                    <span style={{ color: "#666", fontSize: 12 }}>·</span>
                    <span style={{ color: "#888", fontSize: 12 }}>{v.cat}</span>
                  </div>
                  <p
                    style={{
                      color: "#9c9c9c",
                      fontSize: 13,
                      lineHeight: 1.5,
                      marginTop: 8,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {v.blurb}
                  </p>
                  {unplayed && (
                    <div style={{ color: "#ff4d6d", fontSize: 11.5, fontWeight: 700, marginTop: 6 }}>
                      Resume at {Math.floor(p.seconds / 60)}:{String(Math.floor(p.seconds % 60)).padStart(2, "0")}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}