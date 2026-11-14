import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VIDEOS, bySlug, related } from "../data/videos";
import Player from "../components/Player";
import { Avatar, ProgressBar, Thumb } from "../components/VideoCard";
import { useLibrary, useLibraryActions } from "../lib/library";
import { fmt, fmtLong } from "../lib/fmt";

export default function Watch() {
  const { slug } = useParams();
  const nav = useNavigate();
  const found = slug ? bySlug(slug) : undefined;
  const v = found ?? VIDEOS[0];
  const lib = useLibrary();
  const { saveProgress, markWatched, toggleIn, addComment, removeComment, clearProgress } = useLibraryActions();

  const [theater, setTheater] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [draft, setDraft] = useState("");
  const [descOpen, setDescOpen] = useState(false);
  const [resumeAt, setResumeAt] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [justResumed] = useState(() => {
    const p = lib.progress[v.id];
    return Boolean(p && p.seconds > 5 && p.dur > 0 && p.seconds / p.dur < 0.95);
  });

  const upNext = useMemo(() => related(v, 9), [v]);

  /* Reset per-video UI */
  useEffect(() => {
    setDescOpen(false);
    setCountdown(null);
    const p = lib.progress[v.id];
    setResumeAt(p && p.dur > 0 && p.seconds / p.dur < 0.95 ? p.seconds : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.id]);

  /* Record the visit */
  useEffect(() => {
    markWatched(v.id);
    document.title = `${v.title} — YouTubAI`;
    return () => {
      document.title = "YouTubAI";
    };
  }, [v.id, v.title, markWatched]);

  /* Autoplay countdown */
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      nav(`/watch/${upNext[0].slug}`);
      return;
    }
    const id = window.setTimeout(() => setCountdown(c => (c === null ? null : c - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [countdown, nav, upNext]);

  const onProgress = (s: number, d: number) => saveProgress(v.id, s, d);

  const liked = lib.liked.includes(v.id);
  const saved = lib.watchLater.includes(v.id);
  const subbed = lib.subs.includes(v.channelSlug);
  const comments = lib.comments[v.id] ?? [];

  const theaterRef = useRef<HTMLDivElement>(null);

  const submitComment = () => {
    const text = draft.trim();
    if (!text) return;
    addComment(v.id, text);
    setDraft("");
  };

  return (
    <div ref={theaterRef} style={{ maxWidth: theater ? 1680 : 1280 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: theater ? "1fr" : "minmax(0,1fr) 380px",
          gap: theater ? 0 : 24,
          alignItems: "start",
        }}
      >
        {/* ---------------- main column ---------------- */}
        <div style={{ minWidth: 0 }}>
          <Player
            v={v}
            startAt={resumeAt}
            onProgress={onProgress}
            onEnded={() => setCountdown(autoplay ? 8 : null)}
            onTheater={() => setTheater(t => !t)}
            theater={theater}
          />

          {countdown !== null && (
            <div className="yt-card" style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
              <img src={upNext[0].poster} alt="" style={{ width: 96, borderRadius: 8, aspectRatio: "16/9", objectFit: "cover" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: "#aaa", fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase" }}>
                  Up next in {countdown}s
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {upNext[0].title}
                </div>
              </div>
              <button className="yt-btn yt-btn-primary" onClick={() => nav(`/watch/${upNext[0].slug}`)}>Play now</button>
              <button className="yt-btn" onClick={() => setCountdown(null)}>Cancel</button>
            </div>
          )}

          <h1 style={{ fontSize: 20, fontWeight: 700, margin: "14px 0 0", lineHeight: 1.3, letterSpacing: "-.01em" }}>{v.title}</h1>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginTop: 12 }}>
            <button
              onClick={() => nav(`/channel/${v.channelSlug}`)}
              style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", color: "inherit", padding: 0 }}
            >
              <Avatar v={v} size={40} />
              <span style={{ textAlign: "left" }}>
                <span style={{ display: "block", fontWeight: 600, fontSize: 14 }}>{v.channel}</span>
                <span style={{ display: "block", color: "#aaa", fontSize: 12 }}>
                  {v.views} views · {v.studio}
                </span>
              </span>
            </button>

            <button
              className={subbed ? "yt-btn" : "yt-btn yt-btn-primary"}
              onClick={() => toggleIn("subs", v.channelSlug)}
              style={{ marginLeft: 4, minWidth: 104 }}
            >
              {subbed ? "Subscribed" : "Subscribe"}
            </button>

            <div style={{ flex: 1 }} />

            <div className="yt-pillgroup">
              <button
                className="yt-btn yt-btn-ghost"
                onClick={() => toggleIn("liked", v.id)}
                aria-pressed={liked}
                style={{ color: liked ? "#ff4d6d" : undefined }}
              >
                <span aria-hidden>👍</span> {liked ? "Liked" : "Like"}
              </button>
              <span style={{ width: 1, background: "#3a3a3a" }} />
              <button className="yt-btn yt-btn-ghost" aria-label="Dislike">
                <span aria-hidden>👎</span>
              </button>
            </div>

            <button className={saved ? "yt-btn yt-btn-on" : "yt-btn"} onClick={() => toggleIn("watchLater", v.id)}>
              {saved ? "✓ Saved" : "Save"}
            </button>
            <button
              className="yt-btn"
              onClick={() => {
                void navigator.clipboard?.writeText(`${location.origin}/watch/${v.slug}`);
              }}
            >
              Share
            </button>
          </div>

          {/* Description / licence block */}
          <div
            className="yt-card"
            style={{ marginTop: 14, padding: 14, cursor: "pointer", background: descOpen ? "#1f1f1f" : "#181818" }}
            onClick={() => setDescOpen(o => !o)}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: "#eee" }}>
              {v.views} views · {v.ago} · {v.cat} · {v.year}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 13.5,
                lineHeight: 1.55,
                color: "#ddd",
                display: "-webkit-box",
                WebkitLineClamp: descOpen ? undefined : 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {v.blurb}
            </div>

            {descOpen && (
              <>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                  {v.tags.map(t => (
                    <span key={t} className="yt-tag">#{t.replace(/\s+/g, "")}</span>
                  ))}
                </div>
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #2e2e2e", fontSize: 12.5, color: "#aaa", lineHeight: 1.6 }}>
                  <div>
                    <strong style={{ color: "#ddd" }}>Produced by</strong> {v.studio}
                  </div>
                  <div>
                    <strong style={{ color: "#ddd" }}>Licence</strong>{" "}
                    <a href={v.licenseUrl} target="_blank" rel="noopener noreferrer" className="yt-link">
                      {v.license}
                    </a>{" "}
                    — an open movie, free to watch and redistribute.
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <strong style={{ color: "#ddd" }}>Runtime</strong> {fmtLong(v.seconds)}
                  </div>
                </div>
              </>
            )}
            {!descOpen && <div style={{ marginTop: 6, fontSize: 12.5, color: "#8f8f8f", fontWeight: 600 }}>…more</div>}
          </div>

          {/* Actions row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            <button className="yt-btn" onClick={() => setAutoplay(a => !a)} aria-pressed={autoplay}>
              Autoplay {autoplay ? "on" : "off"}
            </button>
            {(lib.progress[v.id]?.seconds ?? 0) > 5 && (
              <button className="yt-btn" onClick={() => { clearProgress(v.id); setResumeAt(0); nav(`/watch/${v.slug}?t=0`, { replace: true }); window.location.reload(); }}>
                Restart from beginning
              </button>
            )}
            <button className="yt-btn" onClick={() => setTheater(t => !t)}>
              {theater ? "Exit theater" : "Theater mode"}
            </button>
          </div>

          {/* ---------------- comments ---------------- */}
          <section style={{ marginTop: 26 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>
              {248 + comments.length} Comments
            </h2>

            <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#3ea6ff",
                  color: "#08131c",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                U
              </div>
              <div style={{ flex: 1 }}>
                <input
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && submitComment()}
                  placeholder="Add a comment…"
                  className="yt-input"
                />
                {draft && (
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                    <button className="yt-btn" onClick={() => setDraft("")}>Cancel</button>
                    <button className="yt-btn yt-btn-primary" onClick={submitComment}>Comment</button>
                  </div>
                )}
              </div>
            </div>

            {[
              { id: "seed-1", who: "@renderfarmer", text: `The compositing on this still holds up. ${v.year} and it looks better than most of what ships today.`, at: 0 },
              { id: "seed-2", who: "@eevee_enjoyer", text: "Watched this on a phone at 2am with headphones. Not a single frame wasted.", at: 0 },
              { id: "seed-3", who: "@openmovie_archive", text: `Free, open, and still the best demo of what an open pipeline can do. Licence: ${v.license}.`, at: 0 },
            ].map(c => {
              const own = comments.find(x => x.id === c.id);
              if (own) return null;
              return <CommentRow key={c.id} id={c.id} who={c.who} text={c.text} ago="2 days ago" />;
            })}

            {comments.map(c => (
              <CommentRow key={c.id} id={c.id} who={c.who} text={c.text} ago="just now" onDelete={() => removeComment(v.id, c.id)} />
            ))}
          </section>
        </div>

        {/* ---------------- sidebar ---------------- */}
        <aside style={{ minWidth: 0, paddingTop: theater ? 16 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Up next</h2>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#aaa", cursor: "pointer" }}>
              <input type="checkbox" checked={autoplay} onChange={e => setAutoplay(e.target.checked)} />
              Autoplay
            </label>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {upNext.map(x => {
              const p = lib.progress[x.id];
              const unplayed = p && p.dur > 0 && p.seconds / p.dur < 0.95;
              return (
                <div key={x.id} className="yt-sidecard" onClick={() => nav(`/watch/${x.slug}`)}>
                  <div style={{ position: "relative", width: 168, flexShrink: 0 }}>
                    <Thumb v={x} rounded={8} />
                    {unplayed && <ProgressBar value={p.seconds} dur={p.dur} />}
                  </div>
                  <div style={{ minWidth: 0, paddingTop: 2 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {x.title}
                    </div>
                    <div style={{ color: "#aaa", fontSize: 12, marginTop: 3 }}>{x.channel}</div>
                    <div style={{ color: "#aaa", fontSize: 12 }}>{x.views} views · {x.ago}</div>
                    {unplayed && <div style={{ color: "#ff4d6d", fontSize: 11.5, marginTop: 3, fontWeight: 600 }}>{fmt(Math.max(0, p.dur - p.seconds))} left</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {justResumed && (
            <div className="yt-card" style={{ marginTop: 14, fontSize: 12.5, color: "#bbb", lineHeight: 1.5 }}>
              Resumed from {fmt(resumeAt)} — we keep your place per video.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function CommentRow({ id, who, text, ago, onDelete }: { id: string; who: string; text: string; ago: string; onDelete?: () => void }) {
  const [liked, setLiked] = useState(false);
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#4a4a4a",
          color: "#fff",
          display: "grid",
          placeItems: "center",
          fontWeight: 700,
          fontSize: 13,
          flexShrink: 0,
        }}
      >
        {who.replace("@", "").slice(0, 2).toUpperCase()}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13 }}>
          <strong style={{ fontWeight: 600 }}>{who}</strong>{" "}
          <span style={{ color: "#aaa", fontWeight: 400 }}>{ago}</span>
        </div>
        <div style={{ fontSize: 14, marginTop: 2, lineHeight: 1.45 }}>{text}</div>
        <div style={{ display: "flex", gap: 14, marginTop: 6, color: "#aaa", fontSize: 12 }}>
          <button className="yt-linkbtn" onClick={() => setLiked(l => !l)} style={{ color: liked ? "#ff4d6d" : "#aaa" }}>
            👍 {liked ? 1 : 0}
          </button>
          <button className="yt-linkbtn">Reply</button>
          {onDelete && (
            <button className="yt-linkbtn" onClick={onDelete} data-cid={id}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}