import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-filters',
  standalone: true,
  template: `
    <section class="dashboard-filters" aria-label="Filtros do painel">
      <div class="dashboard-filters__controls">
        <ng-content select="[filterControl]" />
      </div>
      @if (hasActiveFilters) {
        <div class="dashboard-filters__active">
          <ng-content select="[activeFilters]" />
          <button type="button" class="filter-reset" (click)="reset.emit()"
            aria-label="Limpar filtros adicionais">Limpar filtros</button>
        </div>
      }
    </section>
  `,
  styles: []
})
export class DashboardFiltersComponent {
  @Input() hasActiveFilters = false;
  @Output() reset = new EventEmitter<void>();
}
