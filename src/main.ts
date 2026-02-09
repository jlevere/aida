import "./style.css";
import { createEngine } from "./engine.ts";
import { setupInput } from "./input.ts";
import { createRenderer } from "./render.ts";

function main(): void {
  const renderer = createRenderer();
  let settingsOpen = false;

  const engine = createEngine({
    onPrompt: (kana: string): void => {
      renderer.showPrompt(kana);
    },
    onCorrect: (interval: string): void => {
      renderer.showFeedback(`→ ${interval}`);
    },
    onIncorrect: (correctReading: string, interval: string): void => {
      renderer.showFeedback(`${correctReading} · → ${interval}`);
    },
    onStatsUpdate: (stats): void => {
      renderer.updateStats(stats);
    },
  });

  const inputEl = document.querySelector<HTMLInputElement>("#input");
  if (inputEl === null) {
    throw new Error("Input element not found");
  }

  let locked = false;

  const input = setupInput(inputEl, {
    onInput: (value: string): void => {
      if (locked) return;

      const isValidPrefix = engine.checkPrefix(value);
      input.setError(value.length > 0 && !isValidPrefix);

      const result = engine.attempt(value);
      if (result === "correct") {
        input.clear();
        // feedback already shown by onCorrect callback, will auto-fade
        const next = engine.next();
        if (next === null) {
          renderer.showPrompt("—");
        }
        input.focus();
      } else if (result === "incorrect") {
        // Feedback already shown by engine callback
        locked = true;
        setTimeout(() => {
          locked = false;
          input.clear();
          const next = engine.next();
          if (next === null) {
            renderer.showPrompt("—");
          }
          input.focus();
        }, 1200);
      }
    },
  });

  const wordmarkEl = document.querySelector<HTMLButtonElement>("#wordmark");
  if (wordmarkEl !== null) {
    wordmarkEl.addEventListener("click", () => {
      settingsOpen = !settingsOpen;
      renderer.setSettingsOpen(settingsOpen);
    });
  }

  const toggleHiraganaEl = document.querySelector<HTMLButtonElement>("#toggle-hiragana");
  if (toggleHiraganaEl !== null) {
    toggleHiraganaEl.addEventListener("click", () => {
      const currentSettings = engine.getSettings();
      engine.updateSettings({ hiragana: !currentSettings.hiragana });
      renderer.setToggleState("toggle-hiragana", engine.getSettings().hiragana);
      engine.init();
      const next = engine.next();
      if (next === null) {
        renderer.showPrompt("—");
      } else {
        renderer.showPrompt(next.kana);
      }
      input.focus();
    });
  }

  const toggleKatakanaEl = document.querySelector<HTMLButtonElement>("#toggle-katakana");
  if (toggleKatakanaEl !== null) {
    toggleKatakanaEl.addEventListener("click", () => {
      const currentSettings = engine.getSettings();
      engine.updateSettings({ katakana: !currentSettings.katakana });
      renderer.setToggleState("toggle-katakana", engine.getSettings().katakana);
      engine.init();
      const next = engine.next();
      if (next === null) {
        renderer.showPrompt("—");
      } else {
        renderer.showPrompt(next.kana);
      }
      input.focus();
    });
  }

  const resetEl = document.querySelector<HTMLButtonElement>("#reset");
  if (resetEl !== null) {
    resetEl.addEventListener("click", () => {
      if (confirm("Reset all progress?")) {
        engine.resetProgress();
        engine.init();
        const next = engine.next();
        if (next === null) {
          renderer.showPrompt("—");
        } else {
          renderer.showPrompt(next.kana);
        }
        renderer.updateStats(engine.getStats());
        input.focus();
      }
    });
  }

  const toggleThemeEl = document.querySelector<HTMLButtonElement>("#toggle-theme");
  if (toggleThemeEl !== null) {
    toggleThemeEl.addEventListener("click", () => {
      const currentSettings = engine.getSettings();
      const nextTheme = currentSettings.theme === "system"
        ? "light"
        : currentSettings.theme === "light"
        ? "dark"
        : "system";
      engine.updateSettings({ theme: nextTheme });
      renderer.setTheme(nextTheme);
    });
  }

  const rowToggleButtons = document.querySelectorAll<HTMLButtonElement>("#row-toggles button");
  for (const button of rowToggleButtons) {
    const row = button.getAttribute("data-row");
    if (row === null) continue;
    button.addEventListener("click", () => {
      const currentSettings = engine.getSettings();
      const currentRows = [...currentSettings.rows];
      const index = currentRows.indexOf(row);
      if (index >= 0) {
        currentRows.splice(index, 1);
      } else {
        currentRows.push(row);
      }
      engine.updateSettings({ rows: currentRows });
      renderer.setRowToggleState(row, currentRows.includes(row));
      engine.init();
      const next = engine.next();
      if (next === null) {
        renderer.showPrompt("—");
      } else {
        renderer.showPrompt(next.kana);
      }
      input.focus();
    });
  }

  // Initialize
  engine.init();
  const initialSettings = engine.getSettings();
  renderer.setToggleState("toggle-hiragana", initialSettings.hiragana);
  renderer.setToggleState("toggle-katakana", initialSettings.katakana);
  renderer.setTheme(initialSettings.theme);
  for (const row of ["a", "ka", "sa", "ta", "na", "ha", "ma", "ya", "ra", "wa", "dakuten", "combo"]) {
    renderer.setRowToggleState(row, initialSettings.rows.includes(row));
  }
  renderer.updateStats(engine.getStats());

  const next = engine.next();
  if (next === null) {
    renderer.showPrompt("—");
  } else {
    renderer.showPrompt(next.kana);
  }

  input.focus();
}

main();
