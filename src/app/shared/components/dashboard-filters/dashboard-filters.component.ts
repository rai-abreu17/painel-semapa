import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-filters',
  standalone: true,
  template: `
    <details class="dashboard-filters" [open]="!compact">
      <summary class="dashboard-filters__summary">
        <span class="filter-summary__values"><ng-content select="[filterSummary]" /></span>
        <span class="filter-summary__count" [class.has-filters]="hasActiveFilters"
          [attr.aria-label]="'Filtros ativos: ' + activeCount">Filtros: {{ activeCount }}</span>
        <span class="filter-summary__chevron" aria-hidden="true"></span>
      </summary>
      <section class="dashboard-filters__panel" aria-label="Filtros do painel">
      <div class="dashboard-filters__controls">
        <ng-content select="[filterControl]" />
      </div>
      <div class="dashboard-filters__active" [class.has-filters]="hasActiveFilters">
        <span class="filter-count" aria-live="polite">Filtros ativos: <strong>{{ activeCount }}</strong></span>
        <div class="dashboard-filters__chips">
          <ng-content select="[activeFilters]" />
        </div>
        @if (hasActiveFilters) {
          <button type="button" class="filter-reset" (click)="reset.emit()"
            aria-label="Limpar filtros adicionais">Limpar</button>
        }
      </div>
      </section>
    </details>
  `,
  styles: []
})
export class DashboardFiltersComponent {
  @Input() hasActiveFilters = false;
  @Input() activeCount = 0;
  @Input() compact = false;
  @Output() reset = new EventEmitter<void>();
}
