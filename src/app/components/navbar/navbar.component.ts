import { Component, HostBinding, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService, Theme, THEME_COLORS } from '../../services/theme.service';
import { AccessibilityService } from '../../services/accessibility.service';

interface SubmenuItem {
  label: string;
  link: string;
  icon: string; // id of inline <svg> symbol in template
}

interface NavItem {
  label: string;
  link: string;
  hasDropdown: boolean;
  submenu?: SubmenuItem[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private themeService = inject(ThemeService);
  private a11y = inject(AccessibilityService);
  asset = (p: string) => this.themeService.asset(p);

  openA11y(): void { this.a11y.open(); }

  currentTheme = this.themeService.currentTheme;
  themes: Theme[] = ['green', 'blue', 'orange', 'dark'];
  themeColors = THEME_COLORS;

  fontSize = signal<'small' | 'normal' | 'large'>(this.readStoredFontSize());
  mobileMenuOpen = signal(false);
  readonly scrolled = signal(false);

  constructor() {
    // Apply persisted font-size on load
    this.applyFontSize(this.fontSize());
  }

  private readStoredFontSize(): 'small' | 'normal' | 'large' {
    if (typeof localStorage === 'undefined') return 'normal';
    const v = localStorage.getItem('dag-font-size');
    return v === 'small' || v === 'large' ? v : 'normal';
  }

  private applyFontSize(size: 'small' | 'normal' | 'large'): void {
    const html = document.documentElement;
    html.style.removeProperty('font-size');
    // CSS zoom scales the entire page proportionally — works with px-based CSS.
    const zoom = { small: '0.9', normal: '1', large: '1.12' }[size];
    html.style.zoom = zoom;
    html.setAttribute('data-font-size', size);
  }

  @HostBinding('class.is-scrolled')
  get isScrolled(): boolean {
    return this.scrolled();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 10);
  }

  private readonly menuIconBase = 'assets/images';

  navItems: NavItem[] = [
    { label: 'Home', link: '/', hasDropdown: false },
    {
      label: 'About Us', link: '/about-us', hasDropdown: true,
      submenu: [
        { label: 'About Us',    link: '/about-us', icon: `${this.menuIconBase}/About_Us_Menu.svg` },
        { label: 'Information', link: '/information', icon: `${this.menuIconBase}/Information_Menu.svg` },
        { label: 'Features',    link: '/features', icon: `${this.menuIconBase}/Features_Menu.svg` },
      ],
    },
    {
      label: 'Farmer Corner', link: '#', hasDropdown: true,
      submenu: [
        { label: 'Bulletins',        link: '/farmer-corner/bulletins', icon: `${this.menuIconBase}/Farmer_Bulletins_Menu.svg` },
        { label: 'Weather Forecast', link: '#', icon: `${this.menuIconBase}/Weather_Forcast_Menu.svg` },
        { label: 'Videos',           link: '#', icon: `${this.menuIconBase}/Videos_Menu.svg` },
      ],
    },
    {
      label: 'Officer Corner', link: '#', hasDropdown: true,
      submenu: [
        { label: 'Advisory Matrix', link: '#', icon: `${this.menuIconBase}/Advisory_Matrix_Menu.svg` },
        { label: 'Bulletins',       link: '#', icon: `${this.menuIconBase}/Officer_Bulletins_Menu.svg` },
        { label: 'Krishi Mausam',   link: '#', icon: `${this.menuIconBase}/Krishi_Mausam_Menu.svg` },
      ],
    },
    { label: 'AgriInfrastructure', link: '#', hasDropdown: true },
  ];

  readonly activeSubmenu = signal<number | null>(null);
  private closeTimer: number | null = null;

  openSubmenu(idx: number): void {
    if (this.closeTimer !== null) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    const item = this.navItems[idx];
    if (item?.submenu?.length) this.activeSubmenu.set(idx);
  }

  scheduleCloseSubmenu(): void {
    if (this.closeTimer !== null) window.clearTimeout(this.closeTimer);
    this.closeTimer = window.setTimeout(() => {
      this.activeSubmenu.set(null);
      this.closeTimer = null;
    }, 180);
  }

  cancelCloseSubmenu(): void {
    if (this.closeTimer !== null) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  closeSubmenu(): void {
    this.activeSubmenu.set(null);
  }

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  setFontSize(size: 'small' | 'normal' | 'large'): void {
    this.fontSize.set(size);
    this.applyFontSize(size);
    try { localStorage.setItem('dag-font-size', size); } catch {}
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }
}
