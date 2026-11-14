import { useNavigate } from "react-router-dom";
import type { Video } from "../data/videos";
import { fmt, pct } from "../lib/fmt";
import { useLibrary } from "../lib/library";

export function Thumb({
  v,
  rounded = 12,
  className,
}: {
  v: Video;
  rounded?: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{ position: "relative", aspectRatio: "16/9", background: "#1c1c1c", borderRadius: rounded, overflow: "hidden" }}
    >
      <img
        src={v.poster}
        alt={v.title}
        loading="lazy"
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <span
        style={{
          position: "absolute",
          bottom: 6,
          right: 6,
          background: "rgba(0,0,0,.82)",
          color: "#fff",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: ".02em",
          padding: "2px 5px",
          borderRadius: 4,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {v.dur}
      </span>
    </div>
  );
}

export function Avatar({ v, size = 36 }: { v: Video; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: v.accent,
        color: "#0f0f0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: size * 0.34,
        letterSpacing: "-.02em",
        flexShrink: 0,
      }}
    >
      {v.avatar}
    </div>
  );
}

export function ProgressBar({ value, dur, height = 3 }: { value: number; dur: number; height?: number }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height, background: "rgba(255,255,255,.28)" }}>
      <div style={{ width: `${pct(value, dur)}%`, height: "100%", background: "#ff0033" }} />
    </div>
  );
}

export function ResumeBadge({ seconds, dur }: { seconds: number; dur: number }) {
  const left = Math.max(0, dur - seconds);
  if (left < 20) return null;
  return (
    <span
      style={{
        position: "absolute",
        bottom: 14,
        left: 6,
        background: "rgba(0,0,0,.85)",
        color: "#fff",
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 6px",
        borderRadius: 4,
      }}
    >
      {fmt(left)} left
    </span>
  );
}

export function VideoCard({ v, size = "md" }: { v: Video; size?: "md" | "sm" }) {
  const nav = useNavigate();
  const lib = useLibrary();
  const p = lib.progress[v.id];
  const unplayed = p && p.dur > 0 && p.seconds / p.dur < 0.95;

  if (size === "sm") {
    return (
      <div
        onClick={() => nav(`/watch/${v.slug}`)}
        style={{ display: "flex", gap: 8, cursor: "pointer", borderRadius: 10, padding: 4, margin: "0 -4px" }}
        className="yt-hover"
      >
        <div style={{ width: 168, flexShrink: 0 }}>
          <div style={{ position: "relative" }}>
            <Thumb v={v} rounded={8} />
            {unplayed && <ProgressBar value={p.seconds} dur={p.dur} />}
          </div>
        </div>
        <div style={{ minWidth: 0, paddingTop: 2 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1.28,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {v.title}
          </div>
          <div style={{ color: "#aaa", fontSize: 12, marginTop: 3 }}>{v.channel}</div>
          <div style={{ color: "#aaa", fontSize: 12 }}>{v.views} views · {v.ago}</div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => nav(`/watch/${v.slug}`)} style={{ cursor: "pointer" }} className="yt-card">
      <div style={{ position: "relative" }}>
        <Thumb v={v} />
        {unplayed && (
          <>
            <ProgressBar value={p.seconds} dur={p.dur} />
            <ResumeBadge seconds={p.seconds} dur={p.dur} />
          </>
        )}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
        <Avatar v={v} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 14,
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {v.title}
          </div>
          <div style={{ color: "#aaa", fontSize: 13, marginTop: 3 }}>{v.channel}</div>
          <div style={{ color: "#aaa", fontSize: 13 }}>
            {v.views} views · {v.ago}
          </div>
        </div>
      </div>
    </div>
  );
}