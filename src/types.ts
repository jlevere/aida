import type { Card } from "ts-fsrs";

/** A kana character with all accepted romanization readings */
export interface KanaEntry {
  readonly kana: string;
  readonly readings: readonly string[];
  readonly group: "gojuon" | "dakuten" | "combo";
  readonly set: "hiragana" | "katakana";
}

/** A card state persisted to localStorage — the FSRS Card plus our metadata */
export interface CardState {
  readonly kana: string;
  readonly card: Card;
  readonly times: readonly number[];  // last N response times in ms
}

/** User preferences */
export interface Settings {
  readonly hiragana: boolean;
  readonly katakana: boolean;
}

/** Aggregate session stats */
export interface SessionStats {
  readonly correct: number;
  readonly incorrect: number;
  readonly totalTime: number;     // cumulative ms
  readonly responses: number;
}
