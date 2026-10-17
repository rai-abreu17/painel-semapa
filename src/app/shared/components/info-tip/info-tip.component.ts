import { Component, ElementRef, Input, ViewChild } from '@angular/core';

let nextTipId = 0;

@Component({
  selector: 'app-info-tip',
  standalone: true,
  template: `
    <button #trigger type="button" class="info-trigger" [attr.aria-label]="'Informações sobre ' + label"
      [attr.aria-describedby]="id" [attr.aria-expanded]="open"
      (mouseenter)="show()" (mouseleave)="hide()" (focus)="show()" (blur)="hide()"
      (click)="pin()">i</button>
    <div #tip [id]="id" class="info-popover" popover="auto" role="tooltip"
      (toggle)="onToggle($event)">
      @if (text) { <span>{{ text }}</span> }
      <ng-content />
    </div>
  `,
  styles: [`
    :host { display: inline-flex; vertical-align: middle; flex: none; }
    .info-trigger { display: inline-flex; align-items: center; justify-content: center;
      width: 24px; height: 24px; padding: 0; border: 1px solid var(--color-border);
      border-radius: 50%; background: var(--color-surface-card); color: var(--color-text-secondary);
      font: 600 12px var(--font-body); cursor: help; }
    .info-trigger:hover, .info-trigger[aria-expanded="true"] {
      background: var(--color-primary-light); color: var(--color-primary-dark); border-color: var(--color-primary); }
    .info-popover { position: fixed; inset: auto; margin: 0; width: min(340px, calc(100vw - 32px));
      max-height: min(440px, 65dvh); overflow: auto; padding: 16px 18px;
      border: 1px solid var(--color-border); border-radius: var(--radius-md);
      background: var(--color-surface-card); color: var(--color-text-secondary);
      box-shadow: var(--shadow-popover); font: 400 13px/1.65 var(--font-body);
      text-wrap: pretty; }
    .info-popover::backdrop { background: transparent; }
  `],
})
export class InfoTipComponent {
  @Input() label = 'este indicador';
  @Input() text?: string;
  @ViewChild('trigger', { static: true }) private trigger!: ElementRef<HTMLButtonElement>;
  @ViewChild('tip', { static: true }) private tip!: ElementRef<HTMLElement>;
  protected readonly id = `info-tip-${nextTipId++}`;
  protected open = false;
  private pinned = false;

  protected show(): void {
    const tip = this.tip.nativeElement;
    tip.showPopover();
    this.open = true;
    const rect = this.trigger.nativeElement.getBoundingClientRect();
    const bounds = tip.getBoundingClientRect();
    tip.style.left = `${Math.max(16, Math.min(rect.left, window.innerWidth - bounds.width - 16))}px`;
    tip.style.top = `${Math.max(16, Math.min(rect.bottom + 8, window.innerHeight - bounds.height - 16))}px`;
  }

  protected hide(): void {
    if (!this.pinned) {
      this.tip.nativeElement.hidePopover();
      this.open = false;
    }
  }

  protected pin(): void {
    this.pinned = !this.pinned;
    if (this.pinned) this.show();
    else this.hide();
  }

  protected onToggle(event: Event): void {
    this.open = (event as Event & { newState: string }).newState === 'open';
    if (!this.open) this.pinned = false;
  }
}
