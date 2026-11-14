import { Link } from "react-router-dom";

const ORIGINAL = ["ai-title","thumb-picker","captions","smart-folders","theme","shortcuts","pip","speed-memory","auto-chapters","up-next","ai-summary","semantic-search","studio","live","shorts","community","memberships","superchat","collab-playlists","watch-party","channel-custom","comments-ai","recs","trending","history","offline","multi-audio","adaptive","verify-badge","content-id","dubbing","highlights","qa-video","comment-summary","recs-explain","auto-tag","thumb-ab","ai-mod","voice-clone","broll","visual-chapters","personalized-home","ai-search-suggest","creator-assistant","auto-shorts","interactive","vr360","collab-edit","ai-cohost","decentralized","ppv","equity-tokens","rt-translate","deepfake-detector","streaks","micro-communities","collab-matcher","dai","watchtime-pay","ai-music"];

export default function FeaturesLab() {
  return (
    <div>
      <h1>Features Lab</h1>
      <p style={{ color: "#aaa" }}>260 built features. Click to explore.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8, marginTop: 16 }}>
        {ORIGINAL.map(id => (
          <Link key={id} to={"/f/" + id} style={{ background: "#272727", padding: 10, borderRadius: 8, color: "#f1f1f1", textDecoration: "none", fontSize: 13 }}>{id}</Link>
        ))}
        {Array.from({ length: 200 }, (_, i) => i + 1).map(n => (
          <Link key={n} to={"/f/idea-" + n} style={{ background: "#1a1a2e", padding: 10, borderRadius: 8, color: "#f1f1f1", textDecoration: "none", fontSize: 13 }}>idea-{n}</Link>
        ))}
      </div>
    </div>
  );
}
