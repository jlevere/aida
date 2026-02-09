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
    onCorrect: (): void => {
      // Prompt will be updated by next()
    },
    onIncorrect: (correctReading: string): void => {
      renderer.showFeedback(correctReading);
    },
    onStatsUpdate: (stats): void => {
      renderer.updateStats(stats);
    },
  });

  const inputEl = document.querySelector<HTMLInputElement>("#input");
  if (inputEl === null) {
    throw new Error("Input element not found");
  }

  const input = setupInput(inputEl, {
    onInput: (value: string): void => {
      const isValidPrefix = engine.checkPrefix(value);
      input.setError(value.length > 0 && !isValidPrefix);

      // Only check for correct match on input (auto-advance)
      const result = engine.attempt(value);
      if (result === "correct") {
        input.clear();
        renderer.clearFeedback();
        const next = engine.next();
        if (next === null) {
          renderer.showPrompt("—");
        }
        input.focus();
      }
    },
    onSubmit: (value: string): void => {
      if (value.length === 0) {
        return;
      }

      // On submit, explicitly evaluate (may mark as incorrect)
      const result = engine.attempt(value, true);
      if (result === "incorrect") {
        // Feedback already shown by engine callback
        setTimeout(() => {
          input.clear();
          const next = engine.next();
          if (next === null) {
            renderer.showPrompt("—");
          }
          input.focus();
        }, 1000);
      } else if (result === "correct") {
        input.clear();
        renderer.clearFeedback();
        const next = engine.next();
        if (next === null) {
          renderer.showPrompt("—");
        }
        input.focus();
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

  // Initialize
  engine.init();
  renderer.setToggleState("toggle-hiragana", engine.getSettings().hiragana);
  renderer.setToggleState("toggle-katakana", engine.getSettings().katakana);
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
