import { Component, HostBinding, HostListener, inject, signal } from '@angular/core';
import { ThemeService, Theme, THEME_COLORS } from '../../services/theme.service';

interface NavItem {
  label: string;
  link: string;
  hasDropdown: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private themeService = inject(ThemeService);
  asset = (p: string) => this.themeService.asset(p);

  currentTheme = this.themeService.currentTheme;
  themes: Theme[] = ['green', 'blue', 'orange', 'dark'];
  themeColors = THEME_COLORS;

  fontSize = signal<'small' | 'normal' | 'large'>('normal');
  mobileMenuOpen = signal(false);
  readonly scrolled = signal(false);

  @HostBinding('class.is-scrolled')
  get isScrolled(): boolean {
    return this.scrolled();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 10);
  }

  navItems: NavItem[] = [
    { label: 'Home', link: '#', hasDropdown: false },
    { label: 'About Us', link: '#', hasDropdown: true },
    { label: 'Farmer Corner', link: '#', hasDropdown: true },
    { label: 'Officer Corner', link: '#', hasDropdown: true },
    { label: 'AgriInfrastructure', link: '#', hasDropdown: true },
  ];

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  setFontSize(size: 'small' | 'normal' | 'large'): void {
    this.fontSize.set(size);
    const sizes = { small: '12px', normal: '14px', large: '16px' };
    document.documentElement.style.fontSize = sizes[size];
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }
}
