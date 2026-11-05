import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'editor-button',
  template: `
    <button
      [class]="buttonClasses()"
      [title]="title()"
      [attr.aria-label]="title()"
      [attr.aria-pressed]="active()"
      (click)="onClick.emit($event)"
      [disabled]="disabled()"
    >
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['../assets/icons/icons.css', 'editor-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorButtonComponent {
  icon = input<string>();
  title = input.required<string>();
  active = input(false);
  disabled = input(false);
  onClick = output<Event>();

  readonly buttonClasses = computed(() => ({
    'ex-toolbar-button': true,
    btn: !!this.icon(),
    ['btn-' + this.icon()!]: !!this.icon(),
    'ex-button-active': this.active(),
    'ex-button-disabled': this.disabled(),
  }));
}
