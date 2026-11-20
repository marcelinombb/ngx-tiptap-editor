import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Editor } from '@tiptap/core';
import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { insertAdjacentParagraph } from '../utils/insert-paragraph-adjacent';

@Component({
  selector: 'ex-node-insert-paragraphs',
  standalone: true,
  template: `
    <button
      type="button"
      class="insert-paragraph-btn insert-paragraph-before"
      title="Inserir parágrafo antes"
      aria-label="Inserir parágrafo antes"
      (mousedown)="onMouseDown($event, 'before')"
      (click)="onClick($event)"
    >
      <svg viewBox="0 0 24 24" width="16" height="16">
        <path
          fill="currentColor"
          d="M11 9l1.42 1.42L8.83 14H18V7h2v9H8.83l3.59 3.58L11 21l-6-6 6-6z"
        />
      </svg>
    </button>
    <button
      type="button"
      class="insert-paragraph-btn insert-paragraph-after"
      title="Inserir parágrafo após"
      aria-label="Inserir parágrafo após"
      (mousedown)="onMouseDown($event, 'after')"
      (click)="onClick($event)"
    >
      <svg viewBox="0 0 24 24" width="16" height="16">
        <path
          fill="currentColor"
          d="M11 9l1.42 1.42L8.83 14H18V7h2v9H8.83l3.59 3.58L11 21l-6-6 6-6z"
        />
      </svg>
    </button>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeInsertParagraphsComponent {
  readonly editor = input.required<Editor>();
  readonly getPos = input.required<() => number | undefined>();
  readonly node = input.required<ProseMirrorNode>();

  onMouseDown(event: MouseEvent, where: 'before' | 'after'): void {
    // Prevent browser default behavior that takes focus away from editor
    event.preventDefault();
    event.stopPropagation();

    const getPosFn = this.getPos();
    if (typeof getPosFn !== 'function') return;

    const pos = getPosFn();
    if (pos === undefined || pos === null) return;

    insertAdjacentParagraph({
      editor: this.editor(),
      pos,
      nodeSize: this.node().nodeSize,
      where,
    });
  }

  onClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
