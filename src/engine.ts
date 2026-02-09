import { Rating } from "ts-fsrs";
import type { CardState, KanaEntry, SessionStats, Settings } from "./types.ts";
import { getActiveKana } from "./kana.ts";
import { initCard, getNextDue, reviewCard, formatInterval } from "./scheduler.ts";
import { loadCards, saveCards, loadSettings, saveSettings, loadStats, saveStats } from "./store.ts";

interface EngineCallbacks {
  onPrompt: (kana: string) => void;
  onCorrect: (interval: string) => void;
  onIncorrect: (correctReading: string, interval: string) => void;
  onStatsUpdate: (stats: SessionStats) => void;
}

interface CurrentState {
  entry: KanaEntry;
  state: CardState;
  startTime: number;
}

export function createEngine(callbacks: EngineCallbacks): {
  init: () => void;
  next: () => { kana: string; readings: readonly string[] } | null;
  attempt: (input: string) => "correct" | "incorrect" | "pending";
  checkPrefix: (input: string) => boolean;
  getCurrentReadings: () => readonly string[] | null;
  getStats: () => SessionStats;
  getSettings: () => Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  resetProgress: () => void;
} {
  let cards = new Map<string, CardState>();
  const defaultRows = ["a", "ka", "sa", "ta", "na", "ha", "ma", "ya", "ra", "wa", "dakuten", "combo"];
  let settings: Settings = { hiragana: true, katakana: false, rows: defaultRows, theme: "system" };
  let stats: SessionStats = { correct: 0, incorrect: 0, totalTime: 0, responses: 0 };
  let current: CurrentState | null = null;

  const kanaMap = new Map<string, KanaEntry>();
  for (const entry of getActiveKana(settings)) {
    kanaMap.set(entry.kana, entry);
  }

  function updateKanaMap(): void {
    kanaMap.clear();
    for (const entry of getActiveKana(settings)) {
      kanaMap.set(entry.kana, entry);
    }
  }

  return {
    init: (): void => {
      cards = loadCards();
      settings = loadSettings();
      stats = loadStats();
      updateKanaMap();

      const activeKana = getActiveKana(settings);
      let needsSave = false;
      for (const entry of activeKana) {
        if (!cards.has(entry.kana)) {
          cards.set(entry.kana, initCard(entry));
          needsSave = true;
        }
      }
      if (needsSave) {
        saveCards(cards);
      }
    },

    next: (): { kana: string; readings: readonly string[] } | null => {
      const activeKana = getActiveKana(settings);
      if (activeKana.length === 0) {
        return null;
      }

      // Filter cards to only active kana
      const activeCards = new Map<string, CardState>();
      for (const entry of activeKana) {
        const cardState = cards.get(entry.kana);
        if (cardState !== undefined) {
          activeCards.set(entry.kana, cardState);
        }
      }

      const nextState = getNextDue(activeCards);
      if (nextState === undefined) {
        return null;
      }

      const entry = kanaMap.get(nextState.kana);
      if (entry === undefined) {
        return null;
      }

      current = {
        entry,
        state: nextState,
        startTime: performance.now(),
      };

      callbacks.onPrompt(entry.kana);
      return { kana: entry.kana, readings: entry.readings };
    },

    attempt: (input: string): "correct" | "incorrect" | "pending" => {
      if (current === null) {
        return "pending";
      }

      const normalized = input.toLowerCase().trim();

      // Empty input is always pending
      if (normalized.length === 0) {
        return "pending";
      }

      // Check if it's an exact match
      for (const reading of current.entry.readings) {
        if (normalized === reading) {
          // Correct answer
          const responseTime = performance.now() - current.startTime;
          const updated = reviewCard(current.state, Rating.Good, responseTime);
          cards.set(current.entry.kana, updated);
          const interval = formatInterval(updated.card);

          stats = {
            correct: stats.correct + 1,
            incorrect: stats.incorrect,
            totalTime: stats.totalTime + responseTime,
            responses: stats.responses + 1,
          };

          saveCards(cards);
          saveStats(stats);
          callbacks.onCorrect(interval);
          callbacks.onStatsUpdate(stats);

          current = null;
          return "correct";
        }
      }

      // Check if it's a valid prefix
      for (const reading of current.entry.readings) {
        if (reading.startsWith(normalized)) {
          return "pending";
        }
      }

      // Not a valid prefix - immediately mark incorrect
      const responseTime = performance.now() - current.startTime;
      const updated = reviewCard(current.state, Rating.Again, responseTime);
      cards.set(current.entry.kana, updated);
      const interval = formatInterval(updated.card);

      stats = {
        correct: stats.correct,
        incorrect: stats.incorrect + 1,
        totalTime: stats.totalTime + responseTime,
        responses: stats.responses + 1,
      };

      saveCards(cards);
      saveStats(stats);
      callbacks.onIncorrect(current.entry.readings[0] ?? "", interval);
      callbacks.onStatsUpdate(stats);

      // Don't clear current yet - let render show feedback first
      return "incorrect";
    },

    checkPrefix: (input: string): boolean => {
      if (current === null) {
        return false;
      }
      const normalized = input.toLowerCase().trim();
      for (const reading of current.entry.readings) {
        if (reading.startsWith(normalized)) {
          return true;
        }
      }
      return false;
    },

    getCurrentReadings: (): readonly string[] | null => {
      if (current === null) {
        return null;
      }
      return current.entry.readings;
    },

    getStats: (): SessionStats => stats,

    getSettings: (): Settings => settings,

    updateSettings: (patch: Partial<Settings>): void => {
      settings = { ...settings, ...patch };
      saveSettings(settings);
      updateKanaMap();

      // Reinit cards for new active set
      const activeKana = getActiveKana(settings);
      let needsSave = false;
      for (const entry of activeKana) {
        if (!cards.has(entry.kana)) {
          cards.set(entry.kana, initCard(entry));
          needsSave = true;
        }
      }
      if (needsSave) {
        saveCards(cards);
      }
    },

    resetProgress: (): void => {
      cards.clear();
      stats = { correct: 0, incorrect: 0, totalTime: 0, responses: 0 };
      saveCards(cards);
      saveStats(stats);
      current = null;

      // Reinit cards for active set
      const activeKana = getActiveKana(settings);
      for (const entry of activeKana) {
        cards.set(entry.kana, initCard(entry));
      }
      saveCards(cards);
    },
  };
}
