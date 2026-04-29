import { Injectable, computed, effect, signal } from '@angular/core';

export type AccessibilityKey =
  | 'textToSpeech'
  | 'biggerText'
  | 'smallText'
  | 'lineHeight'
  | 'highlightLinks'
  | 'textSpacing'
  | 'dyslexiaFriendly'
  | 'hideImages'
  | 'cursor'
  | 'lightDark'
  | 'invertColors';

export interface AccessibilityState {
  textToSpeech: boolean;
  biggerText: number;      // 0..4 slider steps
  smallText: boolean;
  lineHeight: number;      // 0..4 slider steps
  highlightLinks: boolean;
  textSpacing: number;     // 0..4 slider steps
  dyslexiaFriendly: boolean;
  hideImages: boolean;
  cursor: boolean;
  lightDark: boolean;
  invertColors: boolean;
}

const DEFAULTS: AccessibilityState = {
  textToSpeech: false,
  biggerText: 0,
  smallText: false,
  lineHeight: 0,
  highlightLinks: false,
  textSpacing: 0,
  dyslexiaFriendly: false,
  hideImages: false,
  cursor: false,
  lightDark: false,
  invertColors: false,
};

@Injectable({ providedIn: 'root' })
export class AccessibilityService {
  readonly isOpen = signal(false);
  readonly state = signal<AccessibilityState>({ ...DEFAULTS });

  readonly anyActive = computed(() => {
    const s = this.state();
    return (
      s.textToSpeech || s.biggerText > 0 || s.smallText ||
      s.lineHeight > 0 || s.highlightLinks || s.textSpacing > 0 ||
      s.dyslexiaFriendly || s.hideImages || s.cursor ||
      s.lightDark || s.invertColors
    );
  });

  constructor() {
    // Apply settings to <html> as data-attributes + CSS vars
    effect(() => {
      const s = this.state();
      const html = document.documentElement;
      html.dataset['a11yBiggerText'] = String(s.biggerText);
      html.dataset['a11yLineHeight'] = String(s.lineHeight);
      html.dataset['a11yTextSpacing'] = String(s.textSpacing);
      html.classList.toggle('a11y--small-text', s.smallText);
      html.classList.toggle('a11y--highlight-links', s.highlightLinks);
      html.classList.toggle('a11y--dyslexia', s.dyslexiaFriendly);
      html.classList.toggle('a11y--hide-images', s.hideImages);
      html.classList.toggle('a11y--big-cursor', s.cursor);
      html.classList.toggle('a11y--invert', s.invertColors);
      if (s.lightDark) html.setAttribute('data-theme', 'dark');
    });

    // Lock body scroll when panel open
    effect(() => {
      document.body.style.overflow = this.isOpen() ? 'hidden' : '';
    });
  }

  open(): void { this.isOpen.set(true); }
  close(): void { this.isOpen.set(false); }
  toggle(): void { this.isOpen.update(v => !v); }

  toggleBool(key: Exclude<AccessibilityKey, 'biggerText' | 'lineHeight' | 'textSpacing'>): void {
    this.state.update(s => ({ ...s, [key]: !s[key] }));
  }

  stepSlider(key: 'biggerText' | 'lineHeight' | 'textSpacing', delta: 1 | -1): void {
    this.state.update(s => {
      const next = Math.max(0, Math.min(4, s[key] + delta));
      return { ...s, [key]: next };
    });
  }

  resetAll(): void {
    this.state.set({ ...DEFAULTS });
  }
}
