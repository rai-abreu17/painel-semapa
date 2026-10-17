import { Component, Input } from '@angular/core';
import { UiIconComponent } from '../ui-icon/ui-icon.component';
import { InfoTipComponent } from '../info-tip/info-tip.component';

@Component({
  selector: 'app-kpi-stat-card',
  standalone: true,
  imports: [UiIconComponent, InfoTipComponent],
  template: `
    <article class="kpi-card" [class]="tone" [attr.aria-label]="title">
      <div class="kpi-card__header">
        <span class="kpi-card__icon"><app-ui-icon [name]="icon || (tone === 'danger' ? 'chart' : tone === 'primary' ? 'records' : 'people')" /></span>
        <span class="kpi-card__title">{{ title }}</span>
        @if (hint || sub || nota) {
          <app-info-tip [label]="title">
            @if (hint) { <span class="tip-line">{{ hint }}</span> }
            @if (sub) { <span class="tip-line">{{ sub }}</span> }
            @if (nota) { <span class="tip-line">{{ nota }}</span> }
          </app-info-tip>
        }
      </div>

      
      <div class="kpi-card__body">
        <div class="kpi-card__main-val">
          <span class="val">{{ value }}</span>
          @if (valueLabel) {
            <span class="lbl">{{ valueLabel }}</span>
          }
        </div>
        @if (secondaryValue) {
          <div class="kpi-card__sec-val">
            <span class="val">{{ secondaryValue }}</span>
            <span class="lbl">{{ secondaryLabel }}</span>
          </div>
        }
        @if (deltaPct) {
          <span class="kpi-card__delta">{{ deltaPct }}</span>
        }
      </div>

      @if (sub) {
        <p class="kpi-card__context">{{ sub }}</p>
      }

      @if (sparkline) {
        <div class="kpi-card__sparkline">
          <svg viewBox="0 0 100 30" preserveAspectRatio="none">
             <!-- Simplified sparkline representation -->
             <path [attr.d]="sparkline" fill="none" stroke="currentColor" stroke-width="2" opacity="0.6"></path>
             <path [attr.d]="sparkline + ' L 100 30 L 0 30 Z'" fill="currentColor" opacity="0.15"></path>
          </svg>
        </div>
      }
      
      <!-- Se for o estilo do painel-semapa com barra de progresso -->
      @if (barra !== undefined) {
         <div class="progress-bar">
            <div class="progress-bar__fill" [style.width.%]="barra"></div>
         </div>
      }
      
    </article>
  `,
  styleUrl: './kpi-stat-card.component.css',
})
export class KpiStatCardComponent {
  @Input() icon?: string;
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() valueLabel?: string;
  @Input() secondaryValue?: string | number;
  @Input() secondaryLabel?: string;
  @Input() deltaPct?: string;
  @Input() sparkline?: string;
  @Input() tone: 'primary-dark' | 'primary' | 'accent' | 'warning' | 'danger' | 'default' = 'default';
  @Input() hint?: string;
  
  // Específicos do painel-semapa que podem ser mapeados
  @Input() barra?: number;
  @Input() sub?: string;
  @Input() nota?: string;
}
