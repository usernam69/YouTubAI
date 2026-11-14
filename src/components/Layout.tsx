import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { CHANNELS } from "../data/videos";
import { useLibrary } from "../lib/library";

const NAV = [
  { to: "/", icon: "Home", label: "Home" },
  { to: "/shorts", icon: "Shorts", label: "Shorts" },
  { to: "/subs", icon: "Subs", label: "Subscriptions" },
];

const LIB = [
  { to: "/history", icon: "History", label: "History" },
  { to: "/playlists", icon: "Playlists", label: "Playlists" },
  { to: "/watchlater", icon: "Watch later", label: "Watch later" },
  { to: "/liked", icon: "Liked", label: "Liked videos" },
];

function Ico({ name }: { name: string }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "Home":
      return <svg {...common}><path d="M3 10.5 12 3l9 7.5" /><path d="M5.5 9.5V20h13V9.5" /></svg>;
    case "Shorts":
      return <svg {...common}><rect x="6" y="3" width="12" height="18" rx="3" /><path d="M11 9.5l4 2.5-4 2.5z" fill="currentColor" /></svg>;
    case "Subs":
      return <svg {...common}><rect x="2.5" y="6" width="19" height="13" rx="2.5" /><path d="M7 3.5h10" /></svg>;
    case "History":
      return <svg {...common}><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /><path d="M12 8v4.5l3 1.8" /></svg>;
    case "Playlists":
      return <svg {...common}><path d="M4 6h11M4 11h11M4 16h7" /><path d="M17.5 13.5v6l4-3z" fill="currentColor" /></svg>;
    case "Watch later":
      return <svg {...common}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>;
    case "Liked":
      return <svg {...common}><path d="M7 10v10H4V10z" /><path d="M7 10.5 11.5 3c1.6 0 2.5 1 2.5 2.6V9h4.7c1.4 0 2.4 1.3 2 2.6l-1.8 6.2a2 2 0 0 1-1.9 1.4H7" /></svg>;
    case "Search":
      return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></svg>;
    case "Mic":
      return <svg {...common}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" /><path d="M12 18v3" /></svg>;
    case "Plus":
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case "Bell":
      return <svg {...common}><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9" /><path d="M10 18.5a2.2 2.2 0 0 0 4 0" /></svg>;
    case "Lab":
      return <svg {...common}><path d="M9 3h6M10 3v6l-5.5 9A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 9V3" /><path d="M7 15h10" /></svg>;
    case "Menu":
      return <svg {...common}><path d="M3.5 7h17M3.5 12h17M3.5 17h17" /></svg>;
    default:
      return null;
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const loc = useLocation();
  const lib = useLibrary();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  /* "/" focuses search, like YouTube */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Keep the search box in sync with the URL on the search page */
  useEffect(() => {
    if (loc.pathname === "/search") {
      const term = new URLSearchParams(loc.search).get("q") ?? "";
      setQ(term);
    }
  }, [loc.pathname, loc.search]);

  const submit = () => {
    const term = q.trim();
    nav(term ? `/search?q=${encodeURIComponent(term)}` : "/search");
    inputRef.current?.blur();
    setSearchOpen(false);
  };

  const watchActive = loc.pathname.startsWith("/watch/");
  const subsCount = lib.subs.length;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0b0b0b", color: "#f1f1f1" }}>
      <header
        style={{
          height: 56,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 12,
          borderBottom: "1px solid #1f1f1f",
          background: "rgba(11,11,11,.86)",
          backdropFilter: "blur(14px)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <button className="yt-iconbtn" aria-label="Toggle sidebar" onClick={() => setOpen(o => !o)} style={{ color: "#eee" }}>
          <Ico name="Menu" />
        </button>

        <NavLink to="/" style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 800, fontSize: 18, letterSpacing: "-.02em", flexShrink: 0 }}>
          <span
            style={{
              width: 30,
              height: 21,
              borderRadius: 6,
              background: "#ff0033",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 4px 14px rgba(255,0,51,.4)",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M8 5.14v13.72L19 12z" /></svg>
          </span>
          YouTubAI
        </NavLink>

        <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "0 8px" }}>
          <div className="yt-searchwrap" style={{ width: "100%", maxWidth: 620, display: searchOpen ? "flex" : undefined }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                ref={inputRef}
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => window.setTimeout(() => setSearchOpen(false), 120)}
                placeholder="Search films, studios, tags"
                aria-label="Search"
                className="yt-search"
              />
              {q && (
                <button
                  aria-label="Clear search"
                  className="yt-searchclear"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => { setQ(""); inputRef.current?.focus(); }}
                >
                  ✕
                </button>
              )}
            </div>
            <button className="yt-searchbtn" aria-label="Search" onClick={submit}>
              <Ico name="Search" />
            </button>
            <button className="yt-searchbtn yt-searchmic" aria-label="Search with voice" onClick={() => inputRef.current?.focus()}>
              <Ico name="Mic" />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 2, alignItems: "center", flexShrink: 0 }}>
          <button className="yt-iconbtn" aria-label="Create" style={{ color: "#eee" }}><Ico name="Plus" /></button>
          <button className="yt-iconbtn" aria-label="Notifications" style={{ color: "#eee", position: "relative" }}>
            <Ico name="Bell" />
            {subsCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  right: 3,
                  minWidth: 15,
                  height: 15,
                  borderRadius: 8,
                  background: "#ff0033",
                  color: "#fff",
                  fontSize: 9.5,
                  fontWeight: 800,
                  display: "grid",
                  placeItems: "center",
                  padding: "0 3px",
                }}
              >
                {subsCount}
              </span>
            )}
          </button>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#3ea6ff,#1f6feb)",
              color: "#04121f",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: 13,
              marginLeft: 4,
            }}
          >
            U
          </div>
        </div>
      </header>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <aside
          style={{
            width: open ? 236 : 74,
            flexShrink: 0,
            background: "#0b0b0b",
            overflowY: "auto",
            overflowX: "hidden",
            padding: "10px 0 28px",
            transition: "width .18s ease",
            borderRight: open ? "1px solid #171717" : "none",
          }}
        >
          {NAV.map(n => {
            const active = n.to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(n.to);
            return (
              <NavLink
                key={n.to}
                to={n.to}
                className={active ? "yt-nav yt-nav-on" : "yt-nav"}
                title={open ? undefined : n.label}
              >
                <Ico name={n.icon} />
                {open && <span>{n.label}</span>}
                {n.to === "/subs" && open && subsCount > 0 && <span className="yt-navcount">{subsCount}</span>}
              </NavLink>
            );
          })}

          {open && <div className="yt-sep" />}
          {open && <div className="yt-sectlabel">You</div>}

          {LIB.map(n => {
            const active = loc.pathname.startsWith(n.to);
            const count =
              n.to === "/watchlater" ? lib.watchLater.length
              : n.to === "/liked" ? lib.liked.length
              : n.to === "/history" ? lib.history.length
              : 0;
            return (
              <NavLink key={n.to} to={n.to} className={active ? "yt-nav yt-nav-on" : "yt-nav"} title={open ? undefined : n.label}>
                <Ico name={n.icon} />
                {open && <span>{n.label}</span>}
                {open && count > 0 && <span className="yt-navcount">{count}</span>}
                {!open && count > 0 && <span className="yt-navdot" />}
              </NavLink>
            );
          })}

          {open && <div className="yt-sep" />}
          {open && <div className="yt-sectlabel">Studios</div>}
          {CHANNELS.slice(0, 5).map(c => {
            const active = loc.pathname === `/channel/${c.slug}`;
            return (
              <NavLink
                key={c.slug}
                to={`/channel/${c.slug}`}
                className={active ? "yt-nav yt-nav-on" : "yt-nav"}
                title={open ? undefined : c.name}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: c.accent,
                    color: "#0b0b0b",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: 9,
                    flexShrink: 0,
                  }}
                >
                  {c.avatar}
                </span>
                {open && <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>}
              </NavLink>
            );
          })}

          {open && <div className="yt-sep" />}
          <NavLink to="/features" className={loc.pathname.startsWith("/features") || loc.pathname.startsWith("/f/") ? "yt-nav yt-nav-on" : "yt-nav"} title={open ? undefined : "Features Lab"}>
            <Ico name="Lab" />
            {open && <span>Features Lab</span>}
          </NavLink>

          {open && (
            <div style={{ padding: "16px 20px 0", color: "#5c5c5c", fontSize: 11.5, lineHeight: 1.7 }}>
              <div style={{ fontWeight: 700, color: "#7a7a7a", marginBottom: 4 }}>YouTubAI</div>
              Every film here is in the public domain or under a Creative Commons licence, streamed from the Internet Archive.
              <div style={{ marginTop: 8 }}>
                <button className="yt-linkbtn" style={{ color: "#6f6f6f" }} onClick={() => nav("/features")}>Features Lab →</button>
              </div>
            </div>
          )}
        </aside>

        <main style={{ flex: 1, overflowY: "auto", padding: watchActive ? 16 : 20 }}>
          {children}
        </main>
      </div>
    </div>
  );
}