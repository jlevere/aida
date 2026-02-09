import { createEmptyCard, fsrs, generatorParameters, Rating } from "ts-fsrs";
import type { Card } from "ts-fsrs";
import type { CardState, KanaEntry } from "./types.ts";
import type { Grade } from "ts-fsrs";

const params = generatorParameters({
  enable_fuzz: true,
  enable_short_term: true,
  request_retention: 0.85,
});
const f = fsrs(params);

export function initCard(entry: KanaEntry): CardState {
  return {
    kana: entry.kana,
    card: createEmptyCard(),
    times: [],
  };
}

export function getNextDue(cards: Map<string, CardState>): CardState | undefined {
  if (cards.size === 0) {
    return undefined;
  }
  const now = new Date();
  const dueNow: CardState[] = [];
  for (const state of cards.values()) {
    const due = state.card.due instanceof Date ? state.card.due : new Date(state.card.due);
    if (due <= now) {
      dueNow.push(state);
    }
  }
  if (dueNow.length > 0) {
    // Randomly pick from cards that are due now
    return dueNow[Math.floor(Math.random() * dueNow.length)];
  }
  // None are due, find the soonest due date
  let soonestDue: Date | undefined;
  const soonestCandidates: CardState[] = [];
  for (const state of cards.values()) {
    const due = state.card.due instanceof Date ? state.card.due : new Date(state.card.due);
    if (soonestDue === undefined || due < soonestDue) {
      soonestDue = due;
      soonestCandidates.length = 0;
      soonestCandidates.push(state);
    } else if (due.getTime() === soonestDue.getTime()) {
      soonestCandidates.push(state);
    }
  }
  if (soonestCandidates.length > 0) {
    // Randomly pick from cards with the same soonest due date
    return soonestCandidates[Math.floor(Math.random() * soonestCandidates.length)];
  }
  return undefined;
}

export function reviewCard(state: CardState, rating: Rating, responseTime: number): CardState {
  const grade = rating as Grade;
  const result = f.next(state.card, new Date(), grade);
  const times = [...state.times, responseTime].slice(-10); // Keep last 10 times
  return {
    kana: state.kana,
    card: result.card,
    times,
  };
}

export function formatInterval(card: Card): string {
  const now = new Date();
  const due = card.due instanceof Date ? card.due : new Date(card.due);
  const diffMs = due.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.round(diffMs / (1000 * 60 * 60 * 24 * 7));
  const diffMonths = Math.round(diffMs / (1000 * 60 * 60 * 24 * 30));

  if (diffMinutes < 1) {
    return "now";
  } else if (diffMinutes < 60) {
    return `${String(diffMinutes)}m`;
  } else if (diffHours < 24) {
    return `${String(diffHours)}h`;
  } else if (diffDays < 7) {
    return `${String(diffDays)}d`;
  } else if (diffWeeks < 4) {
    return `${String(diffWeeks)}w`;
  } else if (diffMonths < 12) {
    return `${String(diffMonths)}mo`;
  } else {
    const years = Math.round(diffMs / (1000 * 60 * 60 * 24 * 365));
    return `${String(years)}y`;
  }
}
