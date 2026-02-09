import type { SessionStats } from "./types.ts";

export interface Renderer {
  showPrompt(kana: string): void;
  clearPrompt(): void;
  showFeedback(text: string): void;
  clearFeedback(): void;
  updateStats(stats: SessionStats): void;
  setSettingsOpen(open: boolean): void;
  setToggleState(id: "toggle-hiragana" | "toggle-katakana", active: boolean): void;
}

let feedbackTimeout: number | undefined;

export function createRenderer(): Renderer {
  const promptEl = document.querySelector<HTMLDivElement>("#prompt");
  const feedbackEl = document.querySelector<HTMLDivElement>("#feedback");
  const statsEl = document.querySelector<HTMLDivElement>("#stats");
  const settingsEl = document.querySelector<HTMLDivElement>("#settings");
  const toggleHiraganaEl = document.querySelector<HTMLButtonElement>("#toggle-hiragana");
  const toggleKatakanaEl = document.querySelector<HTMLButtonElement>("#toggle-katakana");

  if (promptEl === null || feedbackEl === null || statsEl === null || settingsEl === null) {
    throw new Error("Required DOM elements not found");
  }

  const prompt = promptEl;
  const feedback = feedbackEl;
  const stats = statsEl;
  const settings = settingsEl;

  return {
    showPrompt: (kana: string): void => {
      prompt.style.opacity = "0";
      requestAnimationFrame(() => {
        prompt.textContent = kana;
        prompt.style.opacity = "1";
      });
    },

    clearPrompt: (): void => {
      prompt.textContent = "";
    },

    showFeedback: (text: string): void => {
      if (feedbackTimeout !== undefined) {
        clearTimeout(feedbackTimeout);
      }
      feedback.textContent = text;
      feedbackTimeout = window.setTimeout(() => {
        feedback.textContent = "";
        feedbackTimeout = undefined;
      }, 1500);
    },

    clearFeedback: (): void => {
      if (feedbackTimeout !== undefined) {
        clearTimeout(feedbackTimeout);
        feedbackTimeout = undefined;
      }
      feedback.textContent = "";
    },

    updateStats: (sessionStats: SessionStats): void => {
      if (sessionStats.responses === 0) {
        stats.textContent = "";
        stats.style.opacity = "0";
        return;
      }
      const accuracy = Math.round((sessionStats.correct / sessionStats.responses) * 100);
      const avgTime = (sessionStats.totalTime / sessionStats.responses / 1000).toFixed(1);
      stats.innerHTML = `<span data-tooltip="accuracy">${String(accuracy)}%</span> · <span data-tooltip="avg response">${avgTime}s</span>`;
      if (sessionStats.responses > 2) {
        stats.style.opacity = "1";
      }
    },

    setSettingsOpen: (open: boolean): void => {
      if (open) {
        settings.classList.add("open");
        settings.setAttribute("aria-hidden", "false");
      } else {
        settings.classList.remove("open");
        settings.setAttribute("aria-hidden", "true");
      }
    },

    setToggleState: (id: "toggle-hiragana" | "toggle-katakana", active: boolean): void => {
      const el = id === "toggle-hiragana" ? toggleHiraganaEl : toggleKatakanaEl;
      if (el === null) return;
      if (active) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    },
  };
}
