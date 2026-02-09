export interface InputCallbacks {
  onInput: (value: string) => void;
  onSubmit: (value: string) => void;
}

export interface InputControls {
  clear: () => void;
  focus: () => void;
  setError: (error: boolean) => void;
}

export function setupInput(el: HTMLInputElement, callbacks: InputCallbacks): InputControls {
  const normalize = (value: string): string => value.toLowerCase().trim();

  el.addEventListener("input", () => {
    const normalized = normalize(el.value);
    callbacks.onInput(normalized);
  });

  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const normalized = normalize(el.value);
      callbacks.onSubmit(normalized);
    }
  });

  return {
    clear: (): void => {
      el.value = "";
      el.removeAttribute("data-error");
    },
    focus: (): void => {
      el.focus();
    },
    setError: (error: boolean): void => {
      if (error) {
        el.setAttribute("data-error", "true");
      } else {
        el.removeAttribute("data-error");
      }
    },
  };
}
