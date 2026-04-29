import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { AccessibilityKey, AccessibilityService } from '../../services/accessibility.service';

type ControlType = 'toggle' | 'slider';

interface SettingCard {
  key: AccessibilityKey;
  label: string;
  icon: string;           // id referencing SVG symbol in template
  control: ControlType;
  placeholder?: boolean;  // renders an invisible 12th slot to preserve 3-col alignment
}

@Component({
  selector: 'app-accessibility-panel',
  standalone: true,
  templateUrl: './accessibility-panel.component.html',
  styleUrl: './accessibility-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessibilityPanelComponent {
  private a11y = inject(AccessibilityService);

  readonly isOpen = this.a11y.isOpen;
  readonly state = this.a11y.state;

  readonly settings: SettingCard[] = [
    { key: 'textToSpeech',     label: 'Text To Speech',     icon: 'icon-speaker',  control: 'toggle' },
    { key: 'biggerText',       label: 'Bigger Text',        icon: 'icon-bigger',   control: 'slider' },
    { key: 'smallText',        label: 'Small Text',         icon: 'icon-smaller',  control: 'toggle' },
    { key: 'lineHeight',       label: 'Line Height',        icon: 'icon-lines',    control: 'slider' },
    { key: 'highlightLinks',   label: 'Highlight Links',    icon: 'icon-link',     control: 'toggle' },
    { key: 'textSpacing',      label: 'Text Spacing',       icon: 'icon-spacing',  control: 'slider' },
    { key: 'dyslexiaFriendly', label: 'Dyslexia Friendly',  icon: 'icon-df',       control: 'toggle' },
    { key: 'hideImages',       label: 'Hide Images',        icon: 'icon-hideimg',  control: 'toggle' },
    { key: 'cursor',           label: 'Cursor',             icon: 'icon-cursor',   control: 'toggle' },
    { key: 'lightDark',        label: 'Light-Dark',         icon: 'icon-moon',     control: 'toggle' },
    { key: 'invertColors',     label: 'Invert Colors',      icon: 'icon-invert',   control: 'toggle' },
    { key: 'textToSpeech',     label: '',                   icon: '',              control: 'toggle', placeholder: true },
  ];

  close(): void { this.a11y.close(); }

  isCardActive(card: SettingCard): boolean {
    if (card.placeholder) return false;
    const s = this.state();
    const v = s[card.key as keyof typeof s];
    return typeof v === 'number' ? v > 0 : !!v;
  }

  isToggleActive(key: AccessibilityKey): boolean {
    const s = this.state();
    const v = s[key as keyof typeof s];
    return typeof v === 'number' ? v > 0 : !!v;
  }

  sliderValue(key: 'biggerText' | 'lineHeight' | 'textSpacing'): number {
    return this.state()[key];
  }

  onToggle(key: AccessibilityKey): void {
    if (key === 'biggerText' || key === 'lineHeight' || key === 'textSpacing') return;
    this.a11y.toggleBool(key as Exclude<AccessibilityKey, 'biggerText' | 'lineHeight' | 'textSpacing'>);
  }

  onSliderStep(key: 'biggerText' | 'lineHeight' | 'textSpacing', delta: 1 | -1): void {
    this.a11y.stepSlider(key, delta);
  }

  onCardClick(card: SettingCard): void {
    if (card.placeholder) return;
    if (card.control === 'toggle') this.onToggle(card.key);
  }

  reset(): void { this.a11y.resetAll(); }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) this.close();
  }
}
