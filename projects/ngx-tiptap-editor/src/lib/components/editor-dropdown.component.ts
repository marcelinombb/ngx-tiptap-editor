import {
  AfterContentInit,
  computed,
  effect,
  Component,
  ElementRef,
  contentChildren,
  inject,
  input,
  model,
  signal,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EditorButtonComponent } from './editor-button.component';
import { Observable, BehaviorSubject } from 'rxjs';
import { ClickOutsideDirective } from '../directives/click-outside.directive';

export class EditorDropdownService {
  private isOpen = new BehaviorSubject<boolean>(false);

  setOpenState(isOpen: boolean) {
    this.isOpen.next(isOpen);
  }

  getOpenState(): Observable<boolean> {
    return this.isOpen.asObservable();
  }
}

@Component({
  standalone: true,
  selector: 'editor-dropdown',
  template: `
    <div class="ex-toolbar-dropdown" (clickOutside)="clickOutside()">
      <button
        [class]="buttonClasses()"
        [title]="displayTitle()"
        [attr.aria-label]="displayTitle()"
        aria-haspopup="true"
        [attr.aria-expanded]="open()"
        (click)="toggle()"
        [disabled]="disabled()"
      >
        <span class="ex-btn-caret" [class.open]="open()"></span>
      </button>
      <div
        class="ex-dropdown-menu"
        [class.ex-dropdown-open]="open()"
        [class.vertical]="orientation() === 'vertical'"
        [class.horizontal]="orientation() === 'horizontal'"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['editor-dropdown.component.scss', '../assets/icons/icons.css'],
  imports: [ClickOutsideDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorDropdownComponent implements AfterContentInit {
  private destroyRef = inject(DestroyRef);

  icon = input<string>();
  orientation = input<'vertical' | 'horizontal'>('vertical');
  open = signal(false);
  currentIcon = signal('');
  title = model<string>('');
  updateIcon = input(true);
  disabled = input(false);
  editorDropdownService = inject(EditorDropdownService);

  readonly buttons = contentChildren(EditorButtonComponent, { descendants: true });
  readonly buttonEls = contentChildren(EditorButtonComponent, {
    read: ElementRef,
    descendants: true,
  });

  readonly activeButton = computed(() => this.buttons().find((btn) => btn.active()));

  readonly displayIcon = computed(() => {
    const active = this.activeButton();
    if (active && active.icon()) {
      return active.icon();
    }
    return this.currentIcon();
  });

  readonly displayTitle = computed(() => {
    const active = this.activeButton();
    if (active && active.title()) {
      return active.title();
    }
    return this.title();
  });

  readonly isActive = computed(() => !!this.activeButton());

  readonly buttonClasses = computed(() => ({
    'ex-toolbar-button': true,
    btn: true,
    ['btn-' + this.displayIcon()]: !!this.displayIcon(),
    'ex-button-active': this.isActive(),
  }));

  constructor() {
    effect((onCleanup) => {
      const buttons = this.buttons();
      if (this.icon() === undefined || this.updateIcon()) {
        const subs = buttons.map((btn) =>
          btn.onClick.subscribe(() => {
            this.setCurrentButton(btn.icon()!, btn.title());
            this.open.set(false);
          }),
        );
        onCleanup(() => subs.forEach((s) => s.unsubscribe()));
      }
    });
  }

  ngAfterContentInit(): void {
    const buttons = this.buttons();

    this.editorDropdownService
      .getOpenState()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isOpen) => {
        if (this.open() !== isOpen) {
          this.open.set(isOpen);
        }
      });

    if (this.icon()) {
      this.setCurrentButton(this.icon()!, this.title());
    } else if (buttons && buttons.length > 0) {
      const first = buttons.at(0)!;
      this.setCurrentButton(first.icon()!, first.title());
    }
  }

  private setCurrentButton(icon: string, title: string) {
    this.currentIcon.set(icon);
    this.title.set(title);
  }

  clickOutside() {
    this.close();
  }

  close() {
    this.open.set(false);
  }

  toggle() {
    const newState = !this.open();
    if (newState) {
      this.editorDropdownService.setOpenState(false);
    }
    this.open.set(newState);
  }
}
