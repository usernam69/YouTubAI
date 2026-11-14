import { useState } from "react";

export default function IdeaPage({ id, title, desc }: { id: string; title: string; desc: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="card">
      <div className="muted" style={{ marginBottom: 8 }}>{id}</div>
      <h2>{title}</h2>
      <p className="muted">{desc}</p>
      <button className="btn" style={{ marginTop: 12 }} onClick={() => setDone(true)}>
        {done ? "✓ Marked built" : "Mark as built"}
      </button>
    </div>
  );
}
