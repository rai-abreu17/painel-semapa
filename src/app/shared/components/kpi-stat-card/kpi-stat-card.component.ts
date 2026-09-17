import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-stat-card',
  standalone: true,
  template: `
    <div class="kpi-card" [class]="tone">
      <div class="kpi-card__header">
        <span class="kpi-card__title">{{ title }}</span>
        @if (hint) {
          <span class="kpi-card__hint-icon" [title]="hint">i</span>
        }
        @if (deltaPct) {
          <span class="kpi-card__delta">{{ deltaPct }}</span>
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
      </div>

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
      
      @if (sub) {
        <span class="kpi-card__sub">{{ sub }}</span>
      }
      @if (nota) {
        <span class="kpi-card__nota">{{ nota }}</span>
      }
    </div>
  `,
  styles: [`
    .kpi-card {
      background: var(--color-surface-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;
      position: relative;
      overflow: hidden;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-card-hover);
      z-index: 1;
    }
    
    .kpi-card.primary-dark {
      background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
      color: #ffffff;
      border-color: var(--color-primary-dark);
    }
    .kpi-card.primary {
      background: linear-gradient(135deg, var(--color-primary) 0%, #6db3dc 100%);
      color: #ffffff;
      border-color: var(--color-primary);
    }
    .kpi-card.accent {
      background: linear-gradient(135deg, var(--color-accent-strong) 0%, var(--color-accent-light) 100%);
      color: #ffffff;
      border-color: var(--color-accent-strong);
    }
    .kpi-card.warning {
      background: linear-gradient(135deg, var(--color-warning) 0%, #d9822e 100%);
      color: #ffffff;
      border-color: var(--color-warning);
    }
    .kpi-card.danger {
      background: linear-gradient(135deg, var(--color-danger) 0%, #c85148 100%);
      color: #ffffff;
      border-color: var(--color-danger);
    }

    .kpi-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .kpi-card__title {
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      line-height: 1.3;
      flex: 1;
    }
    .kpi-card__delta {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 600;
      background: rgba(255,255,255,0.2);
      padding: 4px 8px;
      border-radius: var(--radius-sm);
    }
    
    .kpi-card__body {
      display: flex;
      align-items: flex-end;
      gap: 20px;
      margin-top: 4px;
    }
    .kpi-card__main-val {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .kpi-card__main-val .val {
      font-family: 'Outfit', sans-serif;
      font-size: 40px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: -0.02em;
    }
    .kpi-card__main-val .lbl, .kpi-card__sec-val .lbl {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.8;
      font-family: 'Inter', sans-serif;
    }
    .kpi-card__sec-val {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .kpi-card__sec-val .val {
      font-family: 'Outfit', sans-serif;
      font-size: 24px;
      font-weight: 600;
      line-height: 1;
    }

    .kpi-card__sub {
      font-size: 12px;
      opacity: 0.9;
      font-family: 'Inter', sans-serif;
      margin-top: 4px;
    }
    .kpi-card__nota {
      font-size: 11px;
      opacity: 0.7;
      line-height: 1.4;
      font-family: 'Inter', sans-serif;
    }

    .kpi-card__sparkline {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 48px;
      pointer-events: none;
    }
    .kpi-card__sparkline svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .progress-bar {
      height: 8px;
      background: rgba(0,0,0,0.1);
      border-radius: var(--radius-pill);
      overflow: hidden;
      margin-top: auto;
    }
    .progress-bar__fill {
      height: 8px;
      background: currentColor;
      transform-origin: left;
      animation: estica .6s cubic-bezier(.2,.7,.3,1) both;
      border-radius: var(--radius-pill);
    }
  `]
})
export class KpiStatCardComponent {
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
