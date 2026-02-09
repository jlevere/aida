import type { Card as FSRSCard } from "ts-fsrs";
import type { CardState, Settings, SessionStats } from "./types.ts";

const CARDS_KEY = "aida:cards";
const SETTINGS_KEY = "aida:settings";
const STATS_KEY = "aida:stats";

function dateReviver(_key: string, value: unknown): unknown {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return value;
}

function reviveCardDates(card: FSRSCard): FSRSCard {
  const revived: FSRSCard = {
    ...card,
    due: card.due instanceof Date ? card.due : new Date(card.due),
  };
  if (card.last_review !== undefined) {
    revived.last_review = card.last_review instanceof Date ? card.last_review : new Date(card.last_review);
  }
  return revived;
}

export function loadCards(): Map<string, CardState> {
  const stored = localStorage.getItem(CARDS_KEY);
  if (stored === null) {
    return new Map();
  }
  try {
    const parsed = JSON.parse(stored, dateReviver) as Record<string, CardState>;
    const map = new Map<string, CardState>();
    for (const [kana, state] of Object.entries(parsed)) {
      map.set(kana, {
        ...state,
        card: reviveCardDates(state.card),
      });
    }
    return map;
  } catch {
    return new Map();
  }
}

export function saveCards(cards: Map<string, CardState>): void {
  const obj: Record<string, CardState> = {};
  for (const [kana, state] of cards.entries()) {
    obj[kana] = state;
  }
  localStorage.setItem(CARDS_KEY, JSON.stringify(obj));
}

export function loadSettings(): Settings {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (stored === null) {
    return { hiragana: true, katakana: false };
  }
  try {
    const parsed = JSON.parse(stored) as Partial<Settings>;
    return {
      hiragana: parsed.hiragana === true,
      katakana: parsed.katakana === true,
    };
  } catch {
    return { hiragana: true, katakana: false };
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadStats(): SessionStats {
  const stored = localStorage.getItem(STATS_KEY);
  if (stored === null) {
    return { correct: 0, incorrect: 0, totalTime: 0, responses: 0 };
  }
  try {
    const parsed = JSON.parse(stored) as SessionStats;
    return {
      correct: typeof parsed.correct === "number" ? parsed.correct : 0,
      incorrect: typeof parsed.incorrect === "number" ? parsed.incorrect : 0,
      totalTime: typeof parsed.totalTime === "number" ? parsed.totalTime : 0,
      responses: typeof parsed.responses === "number" ? parsed.responses : 0,
    };
  } catch {
    return { correct: 0, incorrect: 0, totalTime: 0, responses: 0 };
  }
}

export function saveStats(stats: SessionStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function clearAll(): void {
  localStorage.removeItem(CARDS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(STATS_KEY);
}
