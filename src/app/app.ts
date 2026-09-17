import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DashboardStore } from './dashboard.store';
import { HoverStyleDirective } from './hover-style.directive';
import { KpiStatCardComponent } from './shared/components/kpi-stat-card/kpi-stat-card.component';
import { ModalComponent } from './shared/components/modal/modal.component';


@Component({
  selector: 'app-root',
  imports: [HoverStyleDirective, KpiStatCardComponent, ModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected readonly store = inject(DashboardStore);

  ngOnInit(): void {
    this.store.startClock();
  }
  ngOnDestroy(): void {
    this.store.stopClock();
  }
}
