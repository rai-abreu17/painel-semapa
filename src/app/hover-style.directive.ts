import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';

/**
 * Replica o mecanismo `style-hover="..."` do runtime DC original:
 * aplica declarações CSS inline extras enquanto o ponteiro estiver sobre o elemento,
 * restaurando o estilo original ao sair.
 */
@Directive({
  selector: '[appHoverStyle]',
  standalone: true,
})
export class HoverStyleDirective {
  @Input('appHoverStyle') hoverStyle = '';

  private el = inject(ElementRef<HTMLElement>);
  private saved: { prop: string; value: string; priority: string }[] = [];

  @HostListener('mouseenter')
  @HostListener('focusin')
  onEnter() {
    if (!this.hoverStyle) return;
    const style = this.el.nativeElement.style;
    this.saved = [];
    for (const decl of this.hoverStyle.split(';')) {
      const idx = decl.indexOf(':');
      if (idx === -1) continue;
      const prop = decl.slice(0, idx).trim();
      const value = decl.slice(idx + 1).trim();
      if (!prop || !value) continue;
      this.saved.push({ prop, value: style.getPropertyValue(prop), priority: style.getPropertyPriority(prop) });
      style.setProperty(prop, value);
    }
  }

  @HostListener('mouseleave')
  @HostListener('focusout')
  onLeave() {
    const style = this.el.nativeElement.style;
    for (const { prop, value, priority } of this.saved) {
      if (value) style.setProperty(prop, value, priority);
      else style.removeProperty(prop);
    }
    this.saved = [];
  }
}
