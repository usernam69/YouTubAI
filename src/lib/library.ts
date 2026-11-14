import { useCallback, useSyncExternalStore } from "react";

const KEY = "youtubai:library:v1";
const EVT = "youtubai:library-change";

export type Progress = { seconds: number; dur: number; at: number };

export type Library = {
  history: number[];
  progress: Record<number, Progress>;
  liked: number[];
  watchLater: number[];
  subs: string[];
  comments: Record<number, { id: string; who: string; text: string; at: number }[]>;
  searches: string[];
};

const EMPTY: Library = {
  history: [],
  progress: {},
  liked: [],
  watchLater: [],
  subs: [],
  comments: {},
  searches: [],
};

function read(): Library {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Library>;
    return {
      ...EMPTY,
      ...parsed,
      progress: parsed.progress ?? {},
      comments: parsed.comments ?? {},
    };
  } catch {
    return EMPTY;
  }
}

let state: Library = typeof localStorage === "undefined" ? EMPTY : read();

function write(next: Library) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota or private mode; keep in-memory state */
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVT));
}

function subscribe(cb: () => void) {
  const onEvt = () => cb();
  window.addEventListener(EVT, onEvt);
  window.addEventListener("storage", onEvt);
  return () => {
    window.removeEventListener(EVT, onEvt);
    window.removeEventListener("storage", onEvt);
  };
}

const getSnapshot = () => state;

export function update(fn: (cur: Library) => Library) {
  write(fn(state));
}

export function useLibrary(): Library {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

export function useLibraryActions() {
  const toggleIn = useCallback((field: "liked" | "watchLater" | "subs", id: string | number) => {
    update(cur => {
      const list = cur[field] as (string | number)[];
      const has = list.includes(id);
      return { ...cur, [field]: has ? list.filter(x => x !== id) : [id, ...list] } as Library;
    });
  }, []);

  const markWatched = useCallback((id: number) => {
    update(cur => ({
      ...cur,
      history: [id, ...cur.history.filter(x => x !== id)].slice(0, 60),
    }));
  }, []);

  const saveProgress = useCallback((id: number, seconds: number, dur: number) => {
    update(cur => ({
      ...cur,
      progress: { ...cur.progress, [id]: { seconds, dur, at: Date.now() } },
    }));
  }, []);

  const clearProgress = useCallback((id: number) => {
    update(cur => {
      const p = { ...cur.progress };
      delete p[id];
      return { ...cur, progress: p };
    });
  }, []);

  const addComment = useCallback((id: number, text: string, who = "You") => {
    update(cur => {
      const list = cur.comments[id] ?? [];
      return {
        ...cur,
        comments: {
          ...cur.comments,
          [id]: [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, who, text, at: Date.now() }, ...list],
        },
      };
    });
  }, []);

  const removeComment = useCallback((id: number, cid: string) => {
    update(cur => ({
      ...cur,
      comments: { ...cur.comments, [id]: (cur.comments[id] ?? []).filter(c => c.id !== cid) },
    }));
  }, []);

  const rememberSearch = useCallback((q: string) => {
    const t = q.trim();
    if (!t) return;
    update(cur => ({
      ...cur,
      searches: [t, ...cur.searches.filter(s => s.toLowerCase() !== t.toLowerCase())].slice(0, 12),
    }));
  }, []);

  const reset = useCallback(() => write(EMPTY), []);

  return { toggleIn, markWatched, saveProgress, clearProgress, addComment, removeComment, rememberSearch, reset };
}