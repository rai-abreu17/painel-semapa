import { Component, Input } from '@angular/core';

/** Small, consistent icon set for the dashboard's existing navigation and metrics. */
@Component({
  selector: 'app-ui-icon',
  standalone: true,
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path [attr.d]="paths[name] || paths['chart']" />
    </svg>
  `,
  styles: [`:host { display: inline-flex; width: 20px; height: 20px; flex: none; }
    svg { display: block; width: 100%; height: 100%; }`],
})
export class UiIconComponent {
  @Input() name = 'chart';

  protected readonly paths: Record<string, string> = {
    'Visão geral': 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    'Preços e abastecimento': 'M3 7h18l-2 13H5L3 7Z M8 7l4-5 4 5 M9 11v5 M15 11v5',
    'Saúde dos negócios': 'M3 20h18 M6 16v-5 M12 16V4 M18 16V8',
    'Impacto e realocação': 'M3 17l6-6 4 3 8-10 M15 4h6v6 M3 21h18',
    'Adoção e cobertura': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M18 8a3 3 0 0 1 0 6 M22 21v-2a4 4 0 0 0-3-3.87',
    'Cadastro e ocupação': 'M4 21V5h10v16 M14 9h6v12 M2 21h20 M8 9h2 M8 13h2 M8 17h2 M17 13h1 M17 17h1',
    'Programas': 'M3 7h7l2 2h9v11H3V7Z M3 7V4h7l2 3 M12 12v5 M9.5 14.5h5',
    'Governança e privacidade': 'M12 3l8 3v6c0 5-8 9-8 9S4 17 4 12V6l8-3Z M9 12l2 2 4-4',
    chart: 'M3 17l5-5 4 3 8-10 M15 5h5v5',
    people: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M18 8a3 3 0 0 1 0 6 M22 21v-2a4 4 0 0 0-3-3.87',
    activity: 'M2 12h5l3-8 4 16 3-8h5',
    records: 'M6 3h12v18H6V3Z M9 7h6 M9 11h6 M9 15h4',
    lock: 'M5 10h14v11H5V10Z M8 10V6a4 4 0 0 1 8 0v4 M12 14v3',
    menu: 'M4 6h16 M4 12h16 M4 18h16',
    close: 'M6 6l12 12 M18 6 6 18',
    'arrow-right': 'M5 12h14 M14 7l5 5-5 5',
    table: 'M3 4h18v16H3V4Z M3 9h18 M9 9v11 M15 9v11 M3 14h18',
    horizontal: 'M3 12h18 M7 8l-4 4 4 4 M17 8l4 4-4 4',
  };
}
