import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

interface FooterLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private theme = inject(ThemeService);
  asset = (p: string) => this.theme.asset(p);

  currentYear = new Date().getFullYear();

  quickLinks: FooterLink[][] = [
    [
      { label: 'Home', href: '#' },
      { label: 'About Us', href: '#' },
    ],
    [
      { label: 'Information', href: '#' },
      { label: 'Features', href: '#' },
    ],
    [
      { label: 'Farmer Corner', href: '#' },
      { label: 'Officer Corner', href: '#' },
    ],
    [
      { label: 'Agri Infrastructure', href: '#' },
      { label: 'Contact Us', href: '#' },
    ],
  ];

  otherLinks: FooterLink[][] = [
    [
      { label: 'Login', href: '#' },
      { label: 'Feedback', href: '#' },
    ],
    [
      { label: 'Terms & Conditions', href: '#' },
      { label: 'Privacy Policy', href: '#' },
    ],
    [
      { label: 'Copyright Policy', href: '#' },
      { label: 'Hyperlink Policy', href: '#' },
    ],
  ];
}
