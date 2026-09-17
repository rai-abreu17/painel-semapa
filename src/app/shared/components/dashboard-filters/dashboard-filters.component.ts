import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-filters',
  standalone: true,
  template: `
    <header class="filter-bar">
      <!-- Transcluded content for now since semapa has very custom filters -->
      <ng-content></ng-content>
    </header>
  `,
  styles: []
})
export class DashboardFiltersComponent {}
