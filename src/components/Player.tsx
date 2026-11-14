import { useCallback, useEffect, useRef, useState } from "react";
import type { Video } from "../data/videos";
import { clamp, fmt } from "../lib/fmt";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export type PlayerHandle = { seekTo: (t: number) => void };

export default function Player({
  v,
  startAt,
  onProgress,
  onEnded,
  onTheater,
  theater,
}: {
  v: Video;
  startAt: number;
  onProgress: (seconds: number, dur: number) => void;
  onEnded: () => void;
  onTheater: () => void;
  theater: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | null>(null);
  const resumeApplied = useRef(false);
  const lastSaved = useRef(0);

  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(v.seconds);
  const [buffered, setBuffered] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [waiting, setWaiting] = useState(false);
  const [failed, setFailed] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [chrome, setChrome] = useState(true);
  const [hover, setHover] = useState<{ x: number; t: number } | null>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const [full, setFull] = useState(false);

  const el = () => videoRef.current;

  /* Reset when the video changes */
  useEffect(() => {
    resumeApplied.current = false;
    setStarted(false);
    setPlaying(false);
    setTime(0);
    setDur(v.seconds);
    setBuffered(0);
    setFailed(false);
    setShowSpeed(false);
    setSpeed(1);
  }, [v.id, v.seconds]);

  /* Apply resume point once metadata is known */
  const applyResume = useCallback(() => {
    const node = el();
    if (!node || resumeApplied.current) return;
    const target = clamp(startAt, 0, Math.max(0, (node.duration || v.seconds) - 5));
    if (target > 5) {
      try {
        node.currentTime = target;
        setTime(target);
      } catch {
        /* seeking may race metadata; harmless */
      }
    }
    resumeApplied.current = true;
  }, [startAt, v.seconds]);

  useEffect(() => {
    const node = el();
    if (!node) return;
    const onMeta = () => {
      if (isFinite(node.duration) && node.duration > 0) setDur(node.duration);
      applyResume();
    };
    const onTime = () => {
      setTime(node.currentTime);
      const now = Date.now();
      if (now - lastSaved.current > 3000) {
        lastSaved.current = now;
        onProgress(node.currentTime, node.duration || v.seconds);
      }
      if (node.buffered.length) setBuffered(node.buffered.end(node.buffered.length - 1));
    };
    const onPlay = () => {
      setPlaying(true);
      setStarted(true);
    };
    const onPause = () => {
      setPlaying(false);
      onProgress(node.currentTime, node.duration || v.seconds);
    };
    const onWait = () => setWaiting(true);
    const onPlaying = () => setWaiting(false);
    const onEnd = () => {
      setPlaying(false);
      onProgress(node.duration || v.seconds, node.duration || v.seconds);
      onEnded();
    };
    const onErr = () => setFailed(true);

    node.addEventListener("loadedmetadata", onMeta);
    node.addEventListener("durationchange", onMeta);
    node.addEventListener("timeupdate", onTime);
    node.addEventListener("play", onPlay);
    node.addEventListener("pause", onPause);
    node.addEventListener("waiting", onWait);
    node.addEventListener("playing", onPlaying);
    node.addEventListener("ended", onEnd);
    node.addEventListener("error", onErr);
    return () => {
      node.removeEventListener("loadedmetadata", onMeta);
      node.removeEventListener("durationchange", onMeta);
      node.removeEventListener("timeupdate", onTime);
      node.removeEventListener("play", onPlay);
      node.removeEventListener("pause", onPause);
      node.removeEventListener("waiting", onWait);
      node.removeEventListener("playing", onPlaying);
      node.removeEventListener("ended", onEnd);
      node.removeEventListener("error", onErr);
    };
  }, [applyResume, onProgress, onEnded, v.seconds]);

  /* Save on unmount / navigation away */
  useEffect(() => {
    return () => {
      const node = el();
      if (node && node.currentTime > 0) onProgress(node.currentTime, node.duration || v.seconds);
    };
  }, [onProgress, v.seconds]);

  const poke = useCallback(() => {
    setChrome(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (!videoRef.current?.paused) setChrome(false);
    }, 2600);
  }, []);

  useEffect(() => {
    poke();
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [poke]);

  const toggle = useCallback(() => {
    const node = el();
    if (!node) return;
    if (node.paused) void node.play().catch(() => setFailed(true));
    else node.pause();
    poke();
  }, [poke]);

  const seekBy = useCallback(
    (delta: number) => {
      const node = el();
      if (!node) return;
      node.currentTime = clamp(node.currentTime + delta, 0, (node.duration || v.seconds) - 0.1);
      poke();
    },
    [poke, v.seconds]
  );

  const seekToRatio = useCallback(
    (ratio: number) => {
      const node = el();
      if (!node) return;
      const total = node.duration || v.seconds;
      node.currentTime = clamp(ratio, 0, 1) * total;
      setTime(node.currentTime);
      poke();
    },
    [poke, v.seconds]
  );

  const setVol = useCallback((n: number) => {
    const node = el();
    if (!node) return;
    node.volume = clamp(n, 0, 1);
    node.muted = node.volume === 0;
    setVolume(node.volume);
    setMuted(node.muted);
  }, []);

  const toggleMute = useCallback(() => {
    const node = el();
    if (!node) return;
    node.muted = !node.muted;
    setMuted(node.muted);
    poke();
  }, [poke]);

  const goFull = useCallback(() => {
    const node = wrapRef.current;
    if (!node) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void node.requestFullscreen?.().catch(() => undefined);
  }, []);

  const goPip = useCallback(async () => {
    const node = el();
    if (!node) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await node.requestPictureInPicture();
    } catch {
      /* unsupported or blocked */
    }
  }, []);

  useEffect(() => {
    const onFs = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  /* Keyboard shortcuts, scoped to this page */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          toggle();
          break;
        case "arrowright":
        case "l":
          e.preventDefault();
          seekBy(e.shiftKey ? 30 : 5);
          break;
        case "arrowleft":
        case "j":
          e.preventDefault();
          seekBy(e.shiftKey ? -30 : -5);
          break;
        case "arrowup":
          e.preventDefault();
          setVol((videoRef.current?.volume ?? 1) + 0.1);
          poke();
          break;
        case "arrowdown":
          e.preventDefault();
          setVol((videoRef.current?.volume ?? 1) - 0.1);
          poke();
          break;
        case "m":
          toggleMute();
          break;
        case "f":
          goFull();
          break;
        case "t":
          onTheater();
          break;
        case "p":
          void goPip();
          break;
        case "c":
          Array.from(document.querySelectorAll<HTMLButtonElement>("[data-cc]")).forEach(b => b.click());
          break;
        default:
          if (/^[0-9]$/.test(e.key)) {
            e.preventDefault();
            seekToRatio(Number(e.key) / 10);
          }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, seekBy, setVol, toggleMute, goFull, goPip, onTheater, poke, seekToRatio]);

  const onBarPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = barRef.current?.getBoundingClientRect();
    if (!box) return;
    const ratio = clamp((e.clientX - box.left) / box.width, 0, 1);
    setScrubbing(true);
    setHover({ x: e.clientX - box.left, t: ratio * dur });
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onBarMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = barRef.current?.getBoundingClientRect();
    if (!box) return;
    const ratio = clamp((e.clientX - box.left) / box.width, 0, 1);
    setHover({ x: e.clientX - box.left, t: ratio * dur });
    if (scrubbing) {
      const node = el();
      if (node) {
        node.currentTime = ratio * dur;
        setTime(node.currentTime);
      }
    }
  };

  const onBarUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrubbing) return;
    const box = barRef.current?.getBoundingClientRect();
    setScrubbing(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    if (!box) return;
    seekToRatio(clamp((e.clientX - box.left) / box.width, 0, 1));
  };

  const playedPct = dur > 0 ? clamp((time / dur) * 100, 0, 100) : 0;
  const bufPct = dur > 0 ? clamp((buffered / dur) * 100, 0, 100) : 0;

  return (
    <div
      ref={wrapRef}
      onPointerMove={poke}
      onPointerLeave={() => {
        if (playing) setChrome(false);
      }}
      style={{
        position: "relative",
        background: "#000",
        borderRadius: full ? 0 : 14,
        overflow: "hidden",
        aspectRatio: full ? undefined : "16/9",
        width: "100%",
        height: full ? "100%" : undefined,
        boxShadow: full ? "none" : "0 18px 60px -20px rgba(0,0,0,.9)",
        cursor: chrome ? "default" : "none",
      }}
    >
      <video
        ref={videoRef}
        src={v.src}
        poster={v.poster}
        playsInline
        preload="metadata"
        onClick={toggle}
        onDoubleClick={goFull}
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", background: "#000" }}
      />

      {/* Ambient colour bloom from the poster, only while paused */}
      {!started && !failed && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${v.poster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(46px) saturate(1.5)",
            opacity: 0.4,
            transform: "scale(1.15)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Big poster-style play affordance before first play */}
      {!started && !failed && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            background: "linear-gradient(to top, rgba(0,0,0,.72), rgba(0,0,0,.18) 55%, rgba(0,0,0,.42))",
          }}
        >
          <button
            onClick={toggle}
            aria-label="Play video"
            className="yt-bigplay"
            style={{
              width: 82,
              height: 82,
              borderRadius: "50%",
              background: "#ff0033",
              border: "none",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 12px 42px rgba(255,0,51,.45)",
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5.14v13.72L19 12z" />
            </svg>
          </button>
          <div style={{ textAlign: "center", padding: "0 24px" }}>
            <div style={{ fontWeight: 700, fontSize: 20, textShadow: "0 2px 12px rgba(0,0,0,.8)" }}>{v.title}</div>
            <div style={{ color: "#ddd", fontSize: 13, marginTop: 4, textShadow: "0 2px 10px rgba(0,0,0,.8)" }}>
              {v.channel} · {v.year} · {v.dur}
            </div>
          </div>
        </div>
      )}

      {/* Buffering spinner */}
      {waiting && started && !failed && (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none" }}>
          <div className="yt-spin" style={{ width: 46, height: 46, borderRadius: "50%", border: "3px solid rgba(255,255,255,.25)", borderTopColor: "#fff" }} />
        </div>
      )}

      {failed && (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "#0b0b0b", padding: 24 }}>
          <div style={{ textAlign: "center", maxWidth: 420 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>This stream could not be loaded</div>
            <div style={{ color: "#aaa", fontSize: 13, lineHeight: 1.5 }}>
              The archive host may be rate-limiting or offline. Check your connection and try again.
            </div>
            <button className="yt-btn yt-btn-primary" style={{ marginTop: 14 }} onClick={() => { setFailed(false); el()?.load(); }}>
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "40px 14px 10px",
          background: "linear-gradient(to top, rgba(0,0,0,.88), rgba(0,0,0,.45) 55%, transparent)",
          opacity: chrome || !playing ? 1 : 0,
          transform: chrome || !playing ? "none" : "translateY(8px)",
          transition: "opacity .18s ease, transform .18s ease",
        }}
      >
        {/* Scrub bar */}
        <div
          ref={barRef}
          onPointerDown={onBarPointer}
          onPointerMove={onBarMove}
          onPointerUp={onBarUp}
          onPointerCancel={onBarUp}
          onPointerLeave={() => setHover(null)}
          style={{ position: "relative", height: 18, display: "flex", alignItems: "center", cursor: "pointer", touchAction: "none" }}
        >
          <div style={{ position: "absolute", left: 0, right: 0, height: 4, borderRadius: 2, background: "rgba(255,255,255,.28)" }}>
            <div style={{ width: `${bufPct}%`, height: "100%", borderRadius: 2, background: "rgba(255,255,255,.5)" }} />
            <div style={{ position: "absolute", inset: 0, width: `${playedPct}%`, height: "100%", borderRadius: 2, background: "#ff0033" }} />
            <div
              style={{
                position: "absolute",
                left: `${playedPct}%`,
                top: "50%",
                width: 13,
                height: 13,
                borderRadius: "50%",
                background: "#ff0033",
                transform: `translate(-50%,-50%) scale(${scrubbing || hover ? 1.15 : 1})`,
                transition: "transform .12s",
              }}
            />
          </div>
          {hover && (
            <div
              style={{
                position: "absolute",
                left: clamp(hover.x, 34, (barRef.current?.clientWidth ?? 300) - 34),
                bottom: 22,
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,.92)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 7px",
                borderRadius: 4,
                fontVariantNumeric: "tabular-nums",
                pointerEvents: "none",
              }}
            >
              {fmt(hover.t)}
            </div>
          )}
        </div>

        {/* Buttons row */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2, color: "#fff" }}>
          <IconBtn label={playing ? "Pause (k)" : "Play (k)"} onClick={toggle}>
            {playing ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72L19 12z" /></svg>
            )}
          </IconBtn>
          <IconBtn label="Back 5s (←)" onClick={() => seekBy(-5)}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" />
            </svg>
          </IconBtn>
          <IconBtn label="Forward 5s (→)" onClick={() => seekBy(5)}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" />
            </svg>
          </IconBtn>

          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 2 }}>
            <IconBtn label={muted ? "Unmute (m)" : "Mute (m)"} onClick={toggleMute}>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 9v6h4l5 4V5L8 9z" />
                {muted || volume === 0 ? (
                  <path d="M16.5 8.5l5 7m0-7l-5 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                ) : (
                  <path d="M16 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                )}
              </svg>
            </IconBtn>
            <input
              aria-label="Volume"
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={muted ? 0 : volume}
              onChange={e => setVol(Number(e.target.value))}
              className="yt-vol"
              style={{ width: 68 }}
            />
          </div>

          <div style={{ marginLeft: 8, fontSize: 12.5, fontVariantNumeric: "tabular-nums", color: "#eee", letterSpacing: ".01em" }}>
            <span style={{ fontWeight: 600 }}>{fmt(time)}</span>
            <span style={{ color: "#bbb" }}> / {fmt(dur)}</span>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowSpeed(s => !s)}
              className="yt-chip"
              style={{ fontSize: 12, fontWeight: 600, padding: "5px 9px" }}
              aria-label="Playback speed"
            >
              {speed === 1 ? "1×" : `${speed}×`}
            </button>
            {showSpeed && (
              <div className="yt-menu" style={{ bottom: 40, right: 0 }}>
                {SPEEDS.map(s => (
                  <button
                    key={s}
                    className="yt-menu-item"
                    style={{ fontWeight: speed === s ? 700 : 500, color: speed === s ? "#fff" : "#ccc" }}
                    onClick={() => {
                      const node = el();
                      if (node) node.playbackRate = s;
                      setSpeed(s);
                      setShowSpeed(false);
                    }}
                  >
                    {s === 1 ? "Normal" : `${s}×`}
                  </button>
                ))}
              </div>
            )}
          </div>

          <IconBtn label="Picture in picture (p)" onClick={() => void goPip()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" /><rect x="12" y="11" width="7" height="6" rx="1" fill="currentColor" stroke="none" />
            </svg>
          </IconBtn>
          <IconBtn label={theater ? "Default view (t)" : "Theater mode (t)"} onClick={onTheater}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
              <rect x="2.5" y="6" width="19" height="12" rx="2" />
            </svg>
          </IconBtn>
          <IconBtn label={full ? "Exit full screen (f)" : "Full screen (f)"} onClick={goFull}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              {full ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
            </svg>
          </IconBtn>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="yt-iconbtn"
      style={{ background: "transparent", border: "none", color: "#fff", padding: 7, borderRadius: 8, display: "grid", placeItems: "center" }}
    >
      {children}
    </button>
  );
}