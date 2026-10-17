import { Component, HostListener, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DashboardStore } from './dashboard.store';
import { HoverStyleDirective } from './hover-style.directive';
import { KpiStatCardComponent } from './shared/components/kpi-stat-card/kpi-stat-card.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { UiIconComponent } from './shared/components/ui-icon/ui-icon.component';
import { InfoTipComponent } from './shared/components/info-tip/info-tip.component';
import { DashboardFiltersComponent } from './shared/components/dashboard-filters/dashboard-filters.component';


@Component({
  selector: 'app-root',
  imports: [HoverStyleDirective, KpiStatCardComponent, ModalComponent, UiIconComponent, InfoTipComponent, DashboardFiltersComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected readonly store = inject(DashboardStore);
  protected readonly compactViewport = signal(false);

  @HostListener('window:resize')
  protected updateViewport(): void {
    this.compactViewport.set(window.matchMedia('(max-width: 1023.98px)').matches);
  }

  protected toggleNavigation(): void {
    this.store.toggleMobileMenu();
    requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(this.store.mobileMenuOpen()
        ? '.app-sidebar .hamburger-btn' : '.app-header .hamburger-btn')?.focus();
    });
  }

  protected navigate(action: () => void): void {
    action();
    this.store.mobileMenuOpen.set(false);
    if (this.compactViewport()) {
      requestAnimationFrame(() => document.getElementById('page-title')?.focus());
    }
  }

  protected clearAdditionalFilters(): void {
    for (const chip of this.store.vm().chips) chip.rm();
    requestAnimationFrame(() => document.getElementById('sector-filter')?.focus());
  }

  @HostListener('document:keydown', ['$event'])
  protected containNavigationFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.store.mobileMenuOpen() || !this.compactViewport()) return;
    const buttons = document.querySelectorAll<HTMLButtonElement>('.app-sidebar button');
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  @HostListener('document:keydown.escape')
  protected closeNavigation(): void {
    if (this.store.mobileMenuOpen()) {
      this.store.mobileMenuOpen.set(false);
      document.querySelector<HTMLButtonElement>('.app-header .hamburger-btn')?.focus();
    }
  }

  ngOnInit(): void {
    this.updateViewport();
    this.store.startClock();
  }
  ngOnDestroy(): void {
    this.store.stopClock();
  }
}
