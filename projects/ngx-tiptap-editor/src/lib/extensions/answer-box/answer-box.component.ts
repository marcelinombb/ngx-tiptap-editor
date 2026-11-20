import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { AngularNodeViewComponent } from '../../node-view';
import { NodeInsertParagraphsComponent } from '../../components/node-insert-paragraphs.component';
import { NodeSelection } from '@tiptap/pm/state';

@Component({
  selector: 'answer-box-component',
  template: `
    <div
      class="ex-answer-box tiptap-widget"
      [class.ex-selected]="selected()"
      [class.ex-answer-box-no-border]="hideBorder()"
      [attr.data-style]="style()"
    >
      <!-- Header Container for Content -->
      <div
        class="ex-answer-box-header"
        [style.display]="showHeader() ? 'block' : 'none'"
        data-node-view-content
      ></div>

      <!-- Visuals (Box or Lines) -->
      <div
        class="ex-answer-box-visuals"
        contenteditable="false"
        (mousedown)="selectNodeOnMousedown($event)"
      >
        @if (style() === 'lines' || style() === 'numbered-lines') {
          @for (line of linesArray(); track $index) {
            <div class="ex-answer-line">
              @if (style() === 'numbered-lines') {
                <span class="ex-answer-number" [class.ex-answer-number-bold]="numbersBold()"
                  >{{ $index + 1 }}.</span
                >
              }
            </div>
          }
        } @else {
          <!-- Box Style -->
          <div [style.height.px]="boxHeight()"></div>
        }
      </div>

      <!-- Insert Paragraph Buttons -->
      <ex-node-insert-paragraphs [editor]="editor()" [getPos]="getPos()" [node]="node()" />
    </div>
  `,
  styles: [
    `
      /* We expect global styles or styles from editor.scss to apply to .ex-answer-box */
      /* Component host shouldn't block layout */
      :host {
        display: block !important;
        /* margin: 1rem 0; REMOVED to act as wrapper only */
      }
    `,
  ],
  standalone: true,
  imports: [NodeInsertParagraphsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswerBoxComponent extends AngularNodeViewComponent {
  // Computed properties from node attributes
  style = computed(() => this.node().attrs['style'] || 'box');
  lines = computed(() => this.node().attrs['lines'] || 3);
  boxHeight = computed(() => this.lines() * 30 || 100);
  showHeader = computed(() => this.node().attrs['showHeader'] === true);
  hideBorder = computed(() => this.node().attrs['hideBorder'] === true);
  numbersBold = computed(() => this.node().attrs['numbersBold'] !== false);

  linesArray = computed(() => {
    return Array(this.lines()).fill(0);
  });

  /**
   * Clicking on contenteditable=false area would blur the editor BEFORE
   * ProseMirror sets a NodeSelection, causing the BubbleMenuPlugin's
   * blurHandler to fire and hide our floating menu.
   *
   * Solution: prevent default on mousedown (cancels the focus-change),
   * manually set a NodeSelection, then re-focus the editor DOM so that
   * view.hasFocus() stays true when shouldShow() is evaluated.
   */
  selectNodeOnMousedown(event: MouseEvent) {
    event.preventDefault();

    const getPosFn = this.getPos();
    if (typeof getPosFn !== 'function') return;
    const pos = getPosFn();
    if (pos === undefined) return;

    const editor = this.editor();
    const tr = editor.state.tr.setSelection(NodeSelection.create(editor.state.doc, pos));
    editor.view.dispatch(tr);
    editor.view.dom.focus();
  }
}
