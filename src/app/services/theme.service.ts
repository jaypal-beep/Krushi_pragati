import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'green' | 'blue' | 'orange' | 'dark';

export const THEME_COLORS: Record<Theme, string> = {
  green: '#6FD460',
  blue: '#1A6BB2',
  orange: '#F27126',
  dark: '#0D0D0D',
};

const THEME_ASSET_FOLDER: Record<Theme, string> = {
  green: '',
  blue: 'Blue_Theme/',
  orange: 'Saffron_Theme/',
  dark: 'Dark_Theme/',
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly currentTheme = signal<Theme>('green');

  constructor() {
    const saved = localStorage.getItem('dag-theme') as Theme | null;
    if (saved && Object.keys(THEME_COLORS).includes(saved)) {
      this.currentTheme.set(saved);
    }

    effect(() => {
      const theme = this.currentTheme();
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('dag-theme', theme);
    });
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  /**
   * Rewrites a default 'assets/images/<file>' path to the themed variant folder.
   * Accepts full paths or bare filenames. Falls back to the original path if no
   * theme-specific folder is configured.
   */
  asset(path: string): string {
    const folder = THEME_ASSET_FOLDER[this.currentTheme()];
    if (!folder) return path;
    const prefix = 'assets/images/';
    if (path.startsWith(prefix) && !path.startsWith(prefix + folder)) {
      return prefix + folder + path.slice(prefix.length);
    }
    return path;
  }
}
