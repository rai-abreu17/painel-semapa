import { Component, Input } from '@angular/core';

/** Presentation wrapper: selection and actions remain with the projected buttons. */
@Component({
  selector: 'app-segmented-control',
  standalone: true,
  template: `
    <div class="segmented-control" role="group"
      [attr.aria-label]="labelledBy ? null : label"
      [attr.aria-labelledby]="labelledBy || null">
      <ng-content />
    </div>
  `,
  styles: [':host { display: block; min-width: 0; }'],
})
export class SegmentedControlComponent {
  @Input() label = '';
  @Input() labelledBy = '';
}
