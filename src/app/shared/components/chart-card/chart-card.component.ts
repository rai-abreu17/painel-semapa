import { Component, Input } from '@angular/core';
import { InfoTipComponent } from '../info-tip/info-tip.component';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [InfoTipComponent],
  template: `
    <section class="chart-card card">
      <div class="chart-card__header">
        <div class="chart-card__title-group">
          <h2 class="chart-card__title">
            {{ title }}
          </h2>
          @if (eyebrow || infoText || subtitle || footerText) {
            <app-info-tip [label]="title">
              @if (eyebrow) { <span class="tip-line">{{ eyebrow }}</span> }
              @if (infoText) { <span class="tip-line">{{ infoText }}</span> }
              @if (subtitle) { <span class="tip-line">{{ subtitle }}</span> }
              @if (footerText) { <span class="tip-line">{{ footerText }}</span> }
            </app-info-tip>
          }
        </div>
        <div class="chart-card__actions">
          <ng-content select="[actions]"></ng-content>
        </div>
      </div>
      
      <div class="chart-card__content" [class.no-padding]="noPadding">
        <ng-content></ng-content>
      </div>

    </section>
  `,
})
export class ChartCardComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() eyebrow?: string;
  @Input() infoText?: string;
  @Input() footerText?: string;
  @Input() noPadding = false;
}
