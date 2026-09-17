import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  template: `
    <section class="chart-card card">
      <div class="chart-card__header">
        <div class="chart-card__title-group">
          @if (eyebrow) {
             <span class="chart-card__eyebrow">{{ eyebrow }}</span>
          }
          <h2 class="chart-card__title">
            {{ title }}
            @if (infoText) {
              <span class="click-hint" [title]="infoText">i</span>
            }
          </h2>
          @if (subtitle) {
             <span class="chart-card__subtitle">{{ subtitle }}</span>
          }
        </div>
        <div class="chart-card__actions">
          <ng-content select="[actions]"></ng-content>
        </div>
      </div>
      
      <div class="chart-card__content" [class.no-padding]="noPadding">
        <ng-content></ng-content>
      </div>

      @if (footerText) {
        <div class="chart-card__footer">
          {{ footerText }}
        </div>
      }
    </section>
  `,
  styles: [`
    .click-hint {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px; height: 18px;
      font-size: 11px;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      color: var(--color-primary);
      background: var(--color-primary-light);
      border-radius: 50%;
      cursor: help;
      margin-left: 6px;
      transition: all 0.2s ease;
    }
    .click-hint:hover {
      background: var(--color-primary-light-2);
    }
  `]
})
export class ChartCardComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() eyebrow?: string;
  @Input() infoText?: string;
  @Input() footerText?: string;
  @Input() noPadding = false;
}
