import { createEmptyCard, fsrs, generatorParameters, Rating } from "ts-fsrs";
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
  let earliest: CardState | undefined;
  for (const state of cards.values()) {
    const due = state.card.due instanceof Date ? state.card.due : new Date(state.card.due);
    if (due <= now) {
      if (earliest === undefined || due < (earliest.card.due instanceof Date ? earliest.card.due : new Date(earliest.card.due))) {
        earliest = state;
      }
    }
  }
  if (earliest !== undefined) {
    return earliest;
  }
  // None are due, return the one with earliest upcoming due date
  let soonest: CardState | undefined;
  for (const state of cards.values()) {
    const due = state.card.due instanceof Date ? state.card.due : new Date(state.card.due);
    const soonestDue = soonest !== undefined
      ? (soonest.card.due instanceof Date ? soonest.card.due : new Date(soonest.card.due))
      : new Date(0);
    if (soonest === undefined || due < soonestDue) {
      soonest = state;
    }
  }
  return soonest;
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
