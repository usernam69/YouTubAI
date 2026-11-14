import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import IdeaPage from "./IdeaPage";

const VIDEOS = [
  { id: 1, title: "How AI is Changing Video", channel: "TechTalk", views: "1.2M", dur: "12:34" },
  { id: 2, title: "Building a YouTube Clone", channel: "CodeLab", views: "450K", dur: "28:10" },
  { id: 3, title: "React 19 Deep Dive", channel: "Frontend", views: "890K", dur: "45:00" },
  { id: 4, title: "LLM Prompt Engineering", channel: "AI Hub", views: "2.1M", dur: "18:22" },
  { id: 5, title: "CSS Grid Mastery", channel: "Design", views: "320K", dur: "22:15" },
];

const IDEA_DESC: Record<string,string> = {
  "idea-1": 'Serve DASH/HLS with 6 rungs from 144p to 4K so every viewer gets smooth playback.',
  "idea-2": 'Begin playback at 480p within 500ms, then upgrade quality seamlessly.',
  "idea-3": 'Pre-buffer next segment during idle CPU to eliminate stalls.',
  "idea-4": 'Seek to exact frame on hover over the progress bar.',
  "idea-5": 'Change speed 0.25xâ€“2x without chipmunk audio.',
  "idea-6": 'Select in/out points to loop a clip for study.',
  "idea-7": 'Mark A and B points and repeat between them.',
  "idea-8": 'Clickable chapter markers on the seek bar.',
  "idea-9": 'Floating resizable player that follows scroll.',
  "idea-10": 'Native PiP with custom controls overlay.',
  "idea-11": 'Expand player to fill viewport width.',
  "idea-12": 'Glow around player matching video colors.',
  "idea-13": 'Let users pin a quality regardless of bandwidth.',
  "idea-14": 'Cap bitrate on cellular connections.',
  "idea-15": 'Download for offline viewing with expiry.',
  "idea-16": 'Resume across devices via account.',
  "idea-17": 'Switch camera angles where available.',
  "idea-18": 'Drag to look around immersive video.',
  "idea-19": 'Stereoscopic playback in headsets.',
  "idea-20": 'Auto-detect and tone-map HDR10/HLG.',
  "idea-21": 'Play just audio to save bandwidth.',
  "idea-22": 'Stop playback after N minutes.',
  "idea-23": 'Show which parts you replayed.',
  "idea-24": 'Auto-skip silent sections in podcasts.',
  "idea-25": 'Clean creator audio in-browser.',
  "idea-26": 'Level loudness across videos.',
  "idea-27": 'Binaural audio for immersive content.',
  "idea-28": 'Customize font, size, color, background.',
  "idea-29": 'Show two languages simultaneously.',
  "idea-30": 'Translate any subtitle track live.',
  "idea-31": 'Picture-in-picture sign-language interpreter.',
  "idea-32": 'Narrated visual descriptions for blind users.',
  "idea-33": 'Full control without mouse.',
  "idea-34": 'Swipe/scrub on mobile.',
  "idea-35": 'Subtle vibration on mobile interactions.',
  "idea-36": 'Chromecast/AirPlay/DLNA support.',
  "idea-37": 'Use phone as remote for TV playback.',
  "idea-38": 'Synced playback across friends.',
  "idea-39": 'Chat over VOD replays.',
  "idea-40": 'Emoji reactions floating over video.',
  "idea-41": 'Deep links to specific seconds.',
  "idea-42": 'Repeat entire video automatically.',
  "idea-43": 'Grab a frame as an image.',
  "idea-44": 'Turn a clip into a looping GIF.',
  "idea-45": 'Share a 5â€“60s clip with link.',
  "idea-46": 'Customizable embed for external sites.',
  "idea-47": 'Interactive end-screen elements.',
  "idea-48": 'Clickable info cards during playback.',
  "idea-49": 'Product links under the player.',
  "idea-50": 'Event tickets under live streams.',
  "idea-51": 'Find videos by meaning, not keywords.',
  "idea-52": 'Search by image, audio, or video clip.',
  "idea-53": 'Hands-free voice queries.',
  "idea-54": 'Intent-aware autocomplete.',
  "idea-55": 'Fuzzy matching for misspellings.',
  "idea-56": 'Filter by date, duration, quality, language.',
  "idea-57": 'Use AND/OR/NOT in search.',
  "idea-58": 'Save and alert on new matches.',
  "idea-59": 'Re-run past queries quickly.',
  "idea-60": 'Real-time trending by region.',
  "idea-61": 'Ranked lists by category.',
  "idea-62": 'Fresh content from subscribed channels.',
  "idea-63": 'Curated discovery by topic.',
  "idea-64": 'Hub pages for a subject.',
  "idea-65": 'All videos tagged with a hashtag.',
  "idea-66": 'Find channels by topic.',
  "idea-67": 'Discover public playlists.',
  "idea-68": 'Find videos using a given audio track.',
  "idea-69": 'Find the exact moment a topic is discussed.',
  "idea-70": 'Find videos featuring a person.',
  "idea-71": 'Find videos containing an object.',
  "idea-72": 'OCR on-screen text for search.',
  "idea-73": 'Full-text search across captions.',
  "idea-74": 'Search in one language, find in others.',
  "idea-75": 'Rank by your interests.',
  "idea-76": 'Avoid filter bubbles in results.',
  "idea-77": 'Favor recent uploads for news.',
  "idea-78": 'Favor high-retention videos.',
  "idea-79": 'Favor subscribed creators.',
  "idea-80": 'Filter adult content.',
  "idea-81": 'Limit to a country/language.',
  "idea-82": 'Short/medium/long buckets.',
  "idea-83": 'Show only live streams.',
  "idea-84": 'Only HDR/4K content.',
  "idea-85": 'Only 360/VR videos.',
  "idea-86": 'Only short-form.',
  "idea-87": 'Only audio-first content.',
  "idea-88": 'Only playlist results.',
  "idea-89": 'Only channel results.',
  "idea-90": 'Show query volume to creators.',
  "idea-91": 'Suggest alternatives when empty.',
  "idea-92": 'Spelling corrections.',
  "idea-93": 'Suggest related queries.',
  "idea-94": 'Find videos matching an emotion.',
  "idea-95": 'Find fast/slow content.',
  "idea-96": 'Beginner/advanced content.',
  "idea-97": 'Exact minute targeting.',
  "idea-98": 'Audio language filter.',
  "idea-99": 'Caption language filter.',
  "idea-100": 'Visual query builder.## Category 3: Recommendations & Personalization',
};

function VideoCard({ v }: { v: typeof VIDEOS[0] }) {
  return (
    <div className="card">
      <div className="thumb">{v.dur}</div>
      <div style={{ marginTop: 8, fontWeight: 600 }}>{v.title}</div>
      <div className="muted">{v.channel} · {v.views} views</div>
    </div>
  );
}

export default function Feature({ id, title }: { id: string; title: string }) {
  const nav = useNavigate();
  if (id.startsWith("idea-")) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button className="btn secondary" onClick={() => nav("/")}>← Back</button>
          <h1>{title}</h1>
        </div>
        <IdeaPage id={id} title={title} desc={(IDEA_DESC as any)[id] || (IDEA_DESC_BATCH as any)?.[id] || ""} />
      </div>
    );
  }
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button className="btn secondary" onClick={() => nav("/")}>← Back</button>
        <h1>{title}</h1>
      </div>
      {renderFeature(id)}
    </div>
  );
}

function renderFeature(id: string) {
  switch (id) {
    case "ai-title": return <AITitle />;
    case "thumb-picker": return <ThumbPicker />;
    case "captions": return <Captions />;
    case "smart-folders": return <SmartFolders />;
    case "theme": return <ThemeToggle />;
    case "shortcuts": return <Shortcuts />;
    case "pip": return <PIP />;
    case "speed-memory": return <SpeedMemory />;
    case "auto-chapters": return <AutoChapters />;
    case "up-next": return <UpNext />;
    case "ai-summary": return <AISummary />;
    case "semantic-search": return <SemanticSearch />;
    case "studio": return <Studio />;
    case "live": return <Live />;
    case "shorts": return <Shorts />;
    case "community": return <Community />;
    case "memberships": return <Memberships />;
    case "superchat": return <SuperChat />;
    case "collab-playlists": return <CollabPlaylists />;
    case "watch-party": return <WatchParty />;
    case "channel-custom": return <ChannelCustom />;
    case "comments-ai": return <CommentsAI />;
    case "recs": return <Recs />;
    case "trending": return <Trending />;
    case "history": return <History />;
    case "offline": return <Offline />;
    case "multi-audio": return <MultiAudio />;
    case "adaptive": return <Adaptive />;
    case "verify-badge": return <VerifyBadge />;
    case "content-id": return <ContentID />;
    case "dubbing": return <Dubbing />;
    case "highlights": return <Highlights />;
    case "qa-video": return <QAVideo />;
    case "comment-summary": return <CommentSummary />;
    case "recs-explain": return <RecsExplain />;
    case "auto-tag": return <AutoTag />;
    case "thumb-ab": return <ThumbAB />;
    case "ai-mod": return <AIMod />;
    case "voice-clone": return <VoiceClone />;
    case "broll": return <BRoll />;
    case "visual-chapters": return <VisualChapters />;
    case "personalized-home": return <PersonalizedHome />;
    case "ai-search-suggest": return <AISearchSuggest />;
    case "creator-assistant": return <CreatorAssistant />;
    case "auto-shorts": return <AutoShorts />;
    case "interactive": return <Interactive />;
    case "vr360": return <VR360 />;
    case "collab-edit": return <CollabEdit />;
    case "ai-cohost": return <AICohost />;
    case "decentralized": return <Decentralized />;
    case "ppv": return <PPV />;
    case "equity-tokens": return <EquityTokens />;
    case "rt-translate": return <RTTranslate />;
    case "deepfake-detector": return <DeepfakeDetector />;
    case "streaks": return <Streaks />;
    case "micro-communities": return <MicroCommunities />;
    case "collab-matcher": return <CollabMatcher />;
    case "dai": return <DAI />;
    case "watchtime-pay": return <WatchtimePay />;
    case "ai-music": return <AIMusic />;
    default: return <div>Unknown feature</div>;
  }
}

// ---------- Quick wins ----------
function AITitle() {
  const [topic, setTopic] = useState("");
  const [titles, setTitles] = useState<string[]>([]);
  const gen = () => setTitles([
    `Why ${topic || "this"} changes everything`,
    `${topic || "Topic"} explained in 5 minutes`,
    `I tried ${topic || "this"} for 30 days`,
    `The truth about ${topic || "this"}`,
    `${topic || "Topic"}: beginner to pro`,
  ]);
  return (
    <div className="card">
      <input className="input" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Video topic..." />
      <button className="btn" style={{marginTop:8}} onClick={gen}>Generate titles</button>
      <ul style={{marginTop:12}}>{titles.map((t,i)=><li key={i}>{t}</li>)}</ul>
    </div>
  );
}
function ThumbPicker() {
  const ctrs = useMemo(() => [0,1,2,3].map(() => (8 + Math.random() * 5).toFixed(1)), []);
  const [pick, setPick] = useState<number|null>(null);
  return (
    <div className="grid grid-3">
      {[0,1,2,3].map(i=>(
        <div key={i} className="card" onClick={()=>setPick(i)} style={{borderColor: pick===i?"var(--accent)":"var(--border)", cursor:"pointer"}}>
          <div className="thumb">Variant {i+1}</div>
          <div className="muted">Predicted CTR: {ctrs[i]}%</div>
        </div>
      ))}
    </div>
  );
}
function Captions() {
  const [lang, setLang] = useState("en");
  const [done, setDone] = useState(false);
  return (
    <div className="card">
      <select className="input" value={lang} onChange={e=>setLang(e.target.value)}>
        {["en","es","fr","de","ja","ko","hi","ar"].map(l=><option key={l}>{l}</option>)}
      </select>
      <button className="btn" style={{marginTop:8}} onClick={()=>setDone(true)}>Generate captions</button>
      {done && <div className="muted" style={{marginTop:8}}>✓ Captions generated in {lang}. 247 segments, 98.2% confidence.</div>}
    </div>
  );
}
function SmartFolders() {
  const folders = ["Tech","Music","Gaming","Cooking","Fitness"];
  const counts = useMemo(() => folders.map(() => Math.floor(Math.random()*20)+3), []);
  return (
    <div className="grid grid-3">
      {folders.map((f,i)=>(
        <div key={f} className="card">
          <div style={{fontWeight:600}}>{f}</div>
          <div className="muted">{counts[i]} saved videos</div>
        </div>
      ))}
    </div>
  );
}
function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") !== "light");
  const toggle = () => setDark(d => { const n = !d; localStorage.setItem("theme", n ? "dark" : "light"); return n; });
  return (
    <div className="card">
      <div className="row">
        <span>Theme: {dark?"Dark":"Light"}</span>
        <button className="btn" onClick={toggle}>Toggle</button>
      </div>
      <div className="muted" style={{marginTop:8}}>Preference saved to localStorage.</div>
    </div>
  );
}
function Shortcuts() {
  const keys = [["k","Play/Pause"],["j","Rewind 10s"],["l","Forward 10s"],["f","Fullscreen"],["m","Mute"],["c","Captions"],["</>","Speed"],["0-9","Seek %"]];
  return (
    <div className="grid grid-3">
      {keys.map(([k,v])=>(
        <div key={k} className="card row"><kbd style={{background:"var(--bg3)",padding:"2px 6px",borderRadius:4}}>{k}</kbd><span>{v}</span></div>
      ))}
    </div>
  );
}
function PIP() {
  return (
    <div className="card">
      <div className="thumb" style={{maxWidth:400}}>Floating Mini Player</div>
      <div className="muted" style={{marginTop:8}}>Drag to reposition. Stays on top while scrolling.</div>
    </div>
  );
}
function SpeedMemory() {
  const [ch, setCh] = useState("TechTalk");
  const [speed, setSpeed] = useState("1.25x");
  return (
    <div className="card">
      <div className="row"><input className="input" value={ch} onChange={e=>setCh(e.target.value)} /><select className="input" value={speed} onChange={e=>setSpeed(e.target.value)}>{["0.5x","1x","1.25x","1.5x","2x"].map(s=><option key={s}>{s}</option>)}</select></div>
      <div className="muted" style={{marginTop:8}}>Saved: {ch} → {speed}</div>
    </div>
  );
}
function AutoChapters() {
  const ch = ["0:00 Intro","2:14 Setup","5:30 Demo","9:02 Results","11:45 Outro"];
  return <div className="card"><ul>{ch.map(c=><li key={c}>{c}</li>)}</ul></div>;
}
function UpNext() {
  const [q, setQ] = useState(VIDEOS.map(v=>v.id));
  return (
    <div className="card">
      <div className="muted">Drag to reorder queue</div>
      <ul style={{marginTop:8}}>{q.map(id=>{const v=VIDEOS.find(x=>x.id===id); return <li key={id} style={{padding:6}}>{v ? v.title : "Unknown"}</li>;})}</ul>
      <button className="btn secondary" onClick={()=>setQ([...q].reverse())}>Reverse</button>
    </div>
  );
}

// ---------- Bigger features ----------
function AISummary() {
  return <div className="card"><p className="muted">AI summary: This video covers the fundamentals of building a YouTube-like platform with React, including routing, state management, and component design. Key takeaways at 2:14, 5:30, and 9:02.</p></div>;
}
function SemanticSearch() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<typeof VIDEOS>([]);
  return (
    <div className="card">
      <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by meaning..." />
      <button className="btn" style={{marginTop:8}} onClick={()=>setRes(q.trim()===""?VIDEOS:VIDEOS.filter(v=>v.title.toLowerCase().includes(q.toLowerCase())))}>Search</button>
      <div className="grid grid-3" style={{marginTop:12}}>{res.map(v=><VideoCard key={v.id} v={v}/>)}</div>
    </div>
  );
}
function Studio() {
  return (
    <div className="grid grid-3">
      {[{l:"Views",v:"124K"},{l:"Watch time",v:"4.2K hrs"},{l:"Subscribers",v:"+1,203"},{l:"Revenue",v:"$340"},{l:"CTR",v:"6.8%"},{l:"Avg view",v:"4:12"}].map(s=>(
        <div key={s.l} className="card"><div className="muted">{s.l}</div><div style={{fontSize:24,fontWeight:700}}>{s.v}</div></div>
      ))}
    </div>
  );
}
function Live() {
  return <div className="card"><div className="thumb" style={{height:300}}>🔴 LIVE · 1,234 watching</div><div className="muted" style={{marginTop:8}}>RTMP ingest active. Low-latency HLS playback.</div></div>;
}
function Shorts() {
  return (
    <div style={{display:"flex",gap:12,overflowX:"auto"}}>
      {VIDEOS.map(v=>(
        <div key={v.id} className="card" style={{minWidth:180}}><div className="thumb" style={{aspectRatio:"9/16"}}>Short</div><div style={{marginTop:8,fontSize:13}}>{v.title}</div></div>
      ))}
    </div>
  );
}
function Community() {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState<{id:string;text:string}[]>([{id:"init",text:"New video dropping Friday!"}]);
  return (
    <div className="card">
      <textarea className="input" value={post} onChange={e=>setPost(e.target.value)} placeholder="Share an update..." rows={3} />
      <button className="btn" style={{marginTop:8}} onClick={()=>{if(post){setPosts([{id:crypto.randomUUID(),text:post},...posts]);setPost("");}}}>Post</button>
      <ul style={{marginTop:12}}>{posts.map(p=><li key={p.id} style={{padding:8,borderBottom:"1px solid var(--border)"}}>{p.text}</li>)}</ul>
    </div>
  );
}
function Memberships() {
  return (
    <div className="grid grid-3">
      {["Bronze $2.99","Silver $4.99","Gold $9.99"].map(t=>(
        <div key={t} className="card"><div style={{fontWeight:600}}>{t}</div><div className="muted">Perks: badge, emoji, exclusive posts</div><button className="btn" style={{marginTop:8}}>Join</button></div>
      ))}
    </div>
  );
}
function SuperChat() {
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState<{id:string;t:string;a:number}[]>([]);
  return (
    <div className="card">
      <input className="input" value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Super chat message..." />
      <button className="btn" style={{marginTop:8}} onClick={()=>{if(msg){setMsgs([{id:crypto.randomUUID(),t:msg,a:5},...msgs]);setMsg("");}}}>Send $5</button>
      <ul style={{marginTop:12}}>{msgs.map(m=><li key={m.id} style={{padding:6,color:"#ffd700"}}>${m.a} · {m.t}</li>)}</ul>
    </div>
  );
}
function CollabPlaylists() {
  return <div className="card"><div className="muted">Playlist "Road Trip" · 3 collaborators · 24 videos</div><button className="btn" style={{marginTop:8}}>Invite collaborator</button></div>;
}
function WatchParty() {
  return <div className="card"><div className="thumb" style={{height:200}}>Synced playback · 4 viewers</div><div className="muted" style={{marginTop:8}}>Chat panel on right. Host controls playback.</div></div>;
}
function ChannelCustom() {
  return <div className="card"><div style={{height:80,background:"linear-gradient(90deg,#ff0000,#333)",borderRadius:8}}></div><div className="row" style={{marginTop:8}}><div className="thumb" style={{width:64,height:64,borderRadius:"50%",aspectRatio:"1"}}></div><div><div style={{fontWeight:700}}>My Channel</div><div className="muted">12.4K subscribers</div></div></div></div>;
}
function CommentsAI() {
  const [c, setC] = useState("");
  const [list, setList] = useState<{id:string;text:string}[]>([{id:"1",text:"Great video!"},{id:"2",text:"Loved the demo."}]);
  return (
    <div className="card">
      <textarea className="input" value={c} onChange={e=>setC(e.target.value)} placeholder="Add a comment..." rows={2} />
      <button className="btn" style={{marginTop:8}} onClick={()=>{if(c){setList([{id:crypto.randomUUID(),text:c},...list]);setC("");}}}>Comment</button>
      <ul style={{marginTop:12}}>{list.map(x=><li key={x.id} style={{padding:6}}>{x.text}</li>)}</ul>
      <div className="muted">AI moderation: 0 flagged.</div>
    </div>
  );
}
function Recs() {
  return <div className="grid grid-3">{VIDEOS.map(v=><VideoCard key={v.id} v={v}/>)}</div>;
}
function Trending() {
  return <div className="grid grid-3">{VIDEOS.slice().reverse().map(v=><VideoCard key={v.id} v={v}/>)}</div>;
}
function History() {
  return <div className="card"><ul>{VIDEOS.map(v=><li key={v.id} style={{padding:6}}>{v.title}, resumed at 3:20</li>)}</ul></div>;
}
function Offline() {
  return <div className="card"><div className="muted">3 videos downloaded for offline viewing.</div><button className="btn" style={{marginTop:8}}>Manage downloads</button></div>;
}
function MultiAudio() {
  return <div className="card"><select className="input">{["English","Spanish","French","Japanese"].map(l=><option key={l}>{l}</option>)}</select><div className="muted" style={{marginTop:8}}>Audio track switched.</div></div>;
}
function Adaptive() {
  return <div className="card"><div className="muted">Current: 1080p60 · Auto · Buffer: 12s</div><select className="input" style={{marginTop:8}}>{["Auto","144p","360p","720p","1080p","1440p","4K"].map(q=><option key={q}>{q}</option>)}</select></div>;
}
function VerifyBadge() {
  return <div className="card row"><span style={{color:"#3ea6ff",fontSize:20}}>✓</span><span>Verified Creator: 100K+ subscribers, ID verified.</span></div>;
}
function ContentID() {
  return <div className="card"><div className="muted">Scan complete. 0 copyright claims on your 12 videos.</div><button className="btn" style={{marginTop:8}}>Run scan</button></div>;
}

// ---------- AI-native ----------
function Dubbing() {
  return <div className="card"><select className="input">{["Spanish","French","German","Japanese","Hindi"].map(l=><option key={l}>{l}</option>)}</select><div className="muted" style={{marginTop:8}}>Dubbing in progress… lip-sync model: Wav2Lip. ETA 2 min.</div></div>;
}
function Highlights() {
  return <div className="card"><ul>{["0:42 Best moment","3:15 Key insight","7:08 Funny clip"].map(h=><li key={h} style={{padding:6}}>{h}</li>)}</ul><button className="btn" style={{marginTop:8}}>Export as Short</button></div>;
}
function QAVideo() {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const ask = () => setA(`At 5:30, the video explains that ${q || "your question"} is addressed by the demo section. (timestamped answer)`);
  return (
    <div className="card">
      <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask about this video..." />
      <button className="btn" style={{marginTop:8}} onClick={ask}>Ask AI</button>
      {a && <p className="muted" style={{marginTop:8}}>{a}</p>}
    </div>
  );
}
function CommentSummary() {
  return <div className="card"><div className="muted">Sentiment: 87% positive. Top themes: "great explanation", "more advanced topics", "audio quality".</div></div>;
}
function RecsExplain() {
  return <div className="card"><div className="muted">Recommended because you watched "React 19 Deep Dive" and liked "CSS Grid Mastery".</div></div>;
}
function AutoTag() {
  return <div className="card"><div>{["react","typescript","tutorial","web-dev","frontend"].map(t=><span key={t} className="tag">{t}</span>)}</div></div>;
}
function ThumbAB() {
  return <div className="card"><div className="muted">Test running: Variant A vs B. A leading by 12% CTR. Auto-switch in 48h.</div></div>;
}
function AIMod() {
  return <div className="card"><div className="muted">Last 100 uploads scanned. 2 flagged for review, 0 auto-removed.</div><button className="btn" style={{marginTop:8}}>Review queue</button></div>;
}
function VoiceClone() {
  return <div className="card"><div className="muted">Voice profile: "CreatorVoice-v2" trained on 12 min audio. Ready for dubbing.</div><button className="btn" style={{marginTop:8}}>Generate voice</button></div>;
}
function BRoll() {
  return <div className="card"><div className="muted">Suggested B-roll: city timelapse, code editor close-up, abstract tech background.</div></div>;
}
function VisualChapters() {
  return <div className="card"><ul>{["0:00 (scene change)","2:14 (new topic)","5:30 (demo starts)","9:02 (results)"].map(c=><li key={c} style={{padding:6}}>{c}</li>)}</ul></div>;
}
function PersonalizedHome() {
  return <div className="grid grid-3">{VIDEOS.map(v=><VideoCard key={v.id} v={v}/>)}</div>;
}
function AISearchSuggest() {
  const [q,setQ]=useState("");
  const sugg = q ? [q+" tutorial",q+" explained",q+" for beginners"] : [];
  return <div className="card"><input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Type to search..." />{sugg.map(s=><div key={s} className="muted" style={{padding:4}}>{s}</div>)}</div>;
}
function CreatorAssistant() {
  const [msg,setMsg]=useState("");
  const [chat,setChat]=useState<{id:string;u:string;b:string}[]>([]);
  return (
    <div className="card">
      <div style={{height:200,overflowY:"auto",marginBottom:8}}>{chat.map(c=><div key={c.id}><b>You:</b> {c.u}<br/><b>AI:</b> {c.b}</div>)}</div>
      <input className="input" value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Ask the assistant..." />
      <button className="btn" style={{marginTop:8}} onClick={()=>{if(msg){setChat([...chat,{id:crypto.randomUUID(),u:msg,b:"Try a shorter title with a number and a hook. Also A/B test your thumbnail."}]);setMsg("");}}}>Send</button>
    </div>
  );
}
function AutoShorts() {
  return <div className="card"><div className="muted">Detected 3 viral-worthy segments: 1:12-1:45, 4:02-4:38, 9:20-9:55. Ready to render Shorts.</div><button className="btn" style={{marginTop:8}}>Render all</button></div>;
}

// ---------- Wild ideas ----------
function Interactive() {
  return <div className="card"><div className="muted">Branching video: "Choose path A or B at 2:30". Viewer picks, story diverges.</div><button className="btn" style={{marginTop:8}}>Edit branches</button></div>;
}
function VR360() {
  return <div className="card"><div className="thumb" style={{height:240}}>360° Viewer · drag to look around</div></div>;
}
function CollabEdit() {
  return <div className="card"><div className="muted">3 collaborators editing "Final Cut" in real time. Cursor presence shown.</div></div>;
}
function AICohost() {
  return <div className="card"><div className="muted">AI co-host "Nova" ready. Voice: friendly. Knowledge: video topic.</div><button className="btn" style={{marginTop:8}}>Start co-host</button></div>;
}
function Decentralized() {
  return <div className="card"><div className="muted">Storage: IPFS (pinned) · Gateway: cloudflare-ipfs.com · Cost: $0.02/GB.</div></div>;
}
function PPV() {
  return <div className="card"><div className="muted">Pay $1.99 to unlock "Premium Documentary". 42 purchases.</div><button className="btn" style={{marginTop:8}}>Purchase</button></div>;
}
function EquityTokens() {
  return <div className="card"><div className="muted">Token "VID-42": 1000 shares · 0.5% revenue per share · 340 holders.</div></div>;
}
function RTTranslate() {
  return <div className="card"><div className="muted">Live captions: EN → ES, FR, JA. Latency 1.2s. Powered by Gemini.</div></div>;
}
function DeepfakeDetector() {
  return <div className="card"><div className="muted">Media authenticity: 94% confidence real. No synthetic signals detected.</div></div>;
}
function Streaks() {
  return <div className="card"><div style={{fontSize:32,fontWeight:700}}>🔥 14-day streak</div><div className="muted">Watch 10 min today to keep it.</div></div>;
}
function MicroCommunities() {
  return <div className="card"><div className="muted">Communities: React Devs (4.2K), AI Builders (8.1K), Indie Hackers (2.3K).</div><button className="btn" style={{marginTop:8}}>Join community</button></div>;
}
function CollabMatcher() {
  return <div className="card"><div className="muted">Matched with @CodeLab (similar audience, complementary skills). Collab score: 92%.</div><button className="btn" style={{marginTop:8}}>Send invite</button></div>;
}
function DAI() {
  return <div className="card"><div className="muted">Ad break at 4:30 · 15s skippable · Frequency cap 3/day.</div></div>;
}
function WatchtimePay() {
  return <div className="card"><div className="muted">Payout formula: $0.004 per engaged minute. This month: $340.</div></div>;
}
function AIMusic() {
  return <div className="card"><div className="muted">Generated track: "Upbeat Tech" · 2:30 · Royalty-free · Download MP3.</div><button className="btn" style={{marginTop:8}}>Generate new</button></div>;
}


const IDEA_DESC_BATCH: Record<string,string> = {
  "idea-101": 'Personalized home ranked by predicted watch time.',
  "idea-102": 'Rank next video by session continuation.',
  "idea-103": 'Explain recommendations with reason.',
  "idea-104": 'Remove and learn from dismissals.',
  "idea-105": 'Block a channel from recs.',
  "idea-106": 'Recs reflect recent viewing.',
  "idea-107": 'Good recs for new users via trending.',
  "idea-108": 'Inject novel content to broaden taste.',
  "idea-109": 'Limit same creator in feed.',
  "idea-110": 'Boost recent uploads.',
  "idea-111": 'Boost high-retention videos.',
  "idea-112": 'Boost channels you engage with.',
  "idea-113": 'Boost topics you watch.',
  "idea-114": 'Different recs morning vs night.',
  "idea-115": 'Mobile vs TV content mix.',
  "idea-116": 'Detect binge vs research mode.',
  "idea-117": 'Infer mood from viewing patterns.',
  "idea-118": 'Suggest breaks after long sessions.',
  "idea-119": 'Age-appropriate recommendations.',
  "idea-120": 'Separate recs per household member.',
  "idea-121": 'Neutral recs on shared TVs.',
  "idea-122": "Don't influence recs from incognito.",
  "idea-123": 'Clear recommendation history.',
  "idea-124": 'Pin videos to your feed.',
  "idea-125": 'Subscribe to topics not channels.',
  "idea-126": 'Classic subscribe button.',
  "idea-127": 'Granular push settings.',
  "idea-128": 'Weekly personalized digest.',
  "idea-129": 'Thumbs up/down training.',
  "idea-130": 'Recs from saved videos.',
  "idea-131": 'Suggest from your playlists.',
  "idea-132": 'Users like you watched X.',
  "idea-133": 'Similar videos by features.',
  "idea-134": 'Combine multiple recommenders.',
  "idea-135": 'Recs refresh as you watch.',
  "idea-136": 'Experiment on ranking.',
  "idea-137": 'Optimize for long-term satisfaction.',
  "idea-138": 'Avoid rich-get-richer bias.',
  "idea-139": 'Surface emerging creators.',
  "idea-140": 'Find small high-quality channels.',
  "idea-141": 'Favor regional creators.',
  "idea-142": 'Prefer your language.',
  "idea-143": 'Favor captioned content.',
  "idea-144": 'Show why recommended.',
  "idea-145": 'Creator view of ranking.',
  "idea-146": 'Tell creators if suppressed.',
  "idea-147": 'Creators can appeal ranking.',
  "idea-148": 'Manage all rec settings.',
  "idea-149": 'Download your rec profile.',
  "idea-150": 'Bring preferences from other platforms.',
  "idea-151": 'Multi-file drag-and-drop uploader.',
  "idea-152": 'Resume interrupted uploads.',
  "idea-153": 'Large file chunking.',
  "idea-154": 'Per-file progress bars.',
  "idea-155": 'Title, description, tags, category.',
  "idea-156": 'AI suggests title/description/tags.',
  "idea-157": 'Custom thumbnail with preview.',
  "idea-158": 'Auto-generate from frames.',
  "idea-159": 'Test multiple thumbnails.',
  "idea-160": 'CTR prediction before publish.',
  "idea-161": 'SRT/VTT upload.',
  "idea-162": 'Generate captions on upload.',
  "idea-163": 'Edit captions with timestamps.',
  "idea-164": 'Upload many languages.',
  "idea-165": 'Drag-and-drop end screens.',
  "idea-166": 'Add info cards at timestamps.',
  "idea-167": 'Define chapters manually.',
  "idea-168": 'AI detects chapters.',
  "idea-169": 'Public/unlisted/private/scheduled.',
  "idea-170": 'Publish at a future time.',
  "idea-171": 'Scheduled first watch with chat.',
  "idea-172": 'Made for kids toggle.',
  "idea-173": '18+ content gate.',
  "idea-174": 'Block specific countries.',
  "idea-175": 'Allow/disallow embeds.',
  "idea-176": 'Enable/disable comments.',
  "idea-177": 'Show/hide like counts.',
  "idea-178": 'Enable ads or not.',
  "idea-179": 'Standard vs Creative Commons.',
  "idea-180": 'Pick best category.',
  "idea-181": 'Add to playlist on publish.',
  "idea-182": 'Link episodes in a series.',
  "idea-183": 'Add dubbed audio tracks.',
  "idea-184": 'Multiple language audio.',
  "idea-185": 'Accept HDR masters.',
  "idea-186": 'Accept 4K/8K masters.',
  "idea-187": 'Support 60fps/120fps.',
  "idea-188": 'Native 9:16 handling.',
  "idea-189": '1:1 handling.',
  "idea-190": 'Auto-detect letterbox.',
  "idea-191": 'Reusable bumpers.',
  "idea-192": 'Logo, colors, fonts for channel.',
  "idea-193": 'Channel watermark on videos.',
  "idea-194": 'Save upload defaults.',
  "idea-195": 'Edit many videos at once.',
  "idea-196": 'Delete many videos.',
  "idea-197": 'Change visibility in bulk.',
  "idea-198": 'Search/sort/filter library.',
  "idea-199": 'Show used storage.',
  "idea-200": 'Show processing progress.',
};
