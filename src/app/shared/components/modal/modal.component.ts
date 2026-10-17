import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, Output, EventEmitter, inject } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (isOpen) {
      <div class="modal-overlay" (click)="close.emit()">
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title"
          aria-describedby="modal-description" tabindex="-1" (click)="$event.stopPropagation()" [style.maxWidth]="maxWidth">
          <header class="modal-header">
            <div class="modal-header__text">
              <h2 id="modal-title">{{ title }}</h2>
              @if (subtitle) {
                <p id="modal-description">{{ subtitle }}</p>
              }
            </div>
            <div class="modal-header__actions">
              <ng-content select="[actions]"></ng-content>
              <button class="modal-close" (click)="close.emit()" aria-label="Fechar modal">×</button>
            </div>
          </header>
          <div class="modal-body">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  @Input() isOpen = false;
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() maxWidth = '760px';
  @Output() close = new EventEmitter<void>();
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private previousFocus: HTMLElement | null = null;
  private previousOverflow = '';

  ngAfterViewInit(): void {
    this.previousFocus = document.activeElement as HTMLElement;
    this.previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    this.element.nativeElement.querySelector<HTMLButtonElement>('.modal-close')?.focus();
  }

  ngOnDestroy(): void {
    document.body.style.overflow = this.previousOverflow;
    this.previousFocus?.focus();
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close.emit();
    }
    if (event.key !== 'Tab') return;
    const elements = Array.from(this.element.nativeElement.querySelectorAll<HTMLElement>(
      'button:not(:disabled), [href], select, textarea, input, [tabindex="0"]',
    )).filter(element => element.getClientRects().length > 0);
    const first = elements[0];
    const last = elements.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
}
