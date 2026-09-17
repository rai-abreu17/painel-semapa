import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (isOpen) {
      <div class="modal-overlay" (click)="close.emit()">
        <div class="modal-content" (click)="$event.stopPropagation()" [style.maxWidth]="maxWidth">
          <header class="modal-header">
            <div class="modal-header__text">
              <h2>{{ title }}</h2>
              @if (subtitle) {
                <p>{{ subtitle }}</p>
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
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() maxWidth = '1100px';
  @Output() close = new EventEmitter<void>();
}
