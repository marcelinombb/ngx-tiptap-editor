import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { NodeView, ViewMutationRecord, EditorView } from '@tiptap/pm/view';
import { columnResizingPluginKey } from './custom-column-resizing';
import { Editor } from '@tiptap/core';
import { TableMap } from '@tiptap/pm/tables';
import { insertAdjacentParagraph } from '../../utils/insert-paragraph-adjacent';

export function getColStyleDeclaration(
  minWidth: number,
  width: number | undefined,
): [string, string] {
  if (width) {
    // apply the stored width (percentage)
    return ['width', `${width}%`];
  }

  // Fallback to min-width in pixels if no stored width is available
  // though for percentage tables, we might want a percentage fallback too.
  return ['min-width', `${minWidth}px`];
}

export function updateColumns(
  node: ProseMirrorNode,
  colgroup: HTMLTableColElement, // <colgroup> has the same prototype as <col>
  table: HTMLTableElement,
  _cellMinWidth: number, // Marked as unused as it's not directly used in this function's logic
  overrides?: Record<number, number>,
  _isLastColumn?: boolean, // Marked as unused as it's not directly used in this function's logic
) {
  let nextDOM = colgroup.firstChild;
  const row = node.firstChild;

  if (row !== null) {
    const tableMap = TableMap.get(node);
    const colCount = tableMap.width;

    // Collect all widths to normalize if necessary
    const rawWidths: (number | undefined)[] = [];
    for (let i = 0, col = 0; i < row.childCount; i += 1) {
      const { colspan, colwidth } = row.child(i).attrs;
      for (let j = 0; j < colspan; j += 1, col += 1) {
        rawWidths.push(
          overrides && overrides[col] !== undefined
            ? overrides[col]
            : ((colwidth && colwidth[j]) as number | undefined),
        );
      }
    }

    // Normalize widths: they MUST sum to 100% of the table width.
    const sum = rawWidths.reduce((acc, w) => acc! + (w || 0), 0) || 0;
    const allUndefined = rawWidths.every((w) => w == null);

    let normalizedWidths: number[];
    if (allUndefined) {
      normalizedWidths = rawWidths.map(() => 100 / colCount);
    } else if (sum > 0) {
      // Assign equal shares to undefined columns, then scale everything to sum to 100%
      const equalShare = 100 / colCount;
      const rawWithDefaults = rawWidths.map((w) => w ?? equalShare);
      const totalWithDefaults = rawWithDefaults.reduce((a, b) => a + b, 0);
      normalizedWidths = rawWithDefaults.map((w) => (w / totalWithDefaults) * 100);
    } else {
      normalizedWidths = rawWidths.map(() => 100 / colCount);
    }

    // Final NaN guard: replace any NaN values with equal shares
    normalizedWidths = normalizedWidths.map((w) => (Number.isFinite(w) ? w : 100 / colCount));

    let col = 0;
    for (let i = 0; i < row.childCount; i += 1) {
      const { colspan } = row.child(i).attrs;

      for (let j = 0; j < colspan; j += 1, col += 1) {
        const hasWidth = normalizedWidths[col];
        const cssWidth = hasWidth ? `${hasWidth}%` : '';

        if (!nextDOM) {
          const colElement = document.createElement('col');
          colElement.style.width = cssWidth;
          colElement.style.minWidth = `${_cellMinWidth}px`;
          colgroup.appendChild(colElement);
        } else {
          const colElement = nextDOM as HTMLTableColElement;
          if (colElement.style.width !== cssWidth) {
            colElement.style.width = cssWidth;
          }
          if (colElement.style.minWidth !== `${_cellMinWidth}px`) {
            colElement.style.minWidth = `${_cellMinWidth}px`;
          }
          nextDOM = nextDOM.nextSibling;
        }
      }
    }
  }

  while (nextDOM) {
    const after = nextDOM.nextSibling;
    nextDOM.parentNode?.removeChild(nextDOM);
    nextDOM = after;
  }

  // Apply table width to the wrapper (parent of the table)
  const wrapper = table.parentElement;
  if (wrapper && wrapper.classList.contains('tableWrapper')) {
    const widthAttr = node.attrs['width'];
    if (widthAttr) {
      wrapper.style.width = widthAttr;
      wrapper.style.display = 'table';
    } else {
      wrapper.style.width = '';
      wrapper.style.display = ''; // Let CSS default (display: table) take over
    }
  }

  // The table itself should be 100% if we have a wrapper width, or auto if not.
  const hasWidth = !!node.attrs['width'];
  table.style.width = hasWidth ? '100%' : 'auto';
  table.style.tableLayout = hasWidth ? 'fixed' : 'auto';
  table.style.minWidth = '';
}

export class TableView implements NodeView {
  node: ProseMirrorNode;

  cellMinWidth: number;

  dom: HTMLDivElement;

  table: HTMLTableElement;

  colgroup: HTMLTableColElement;

  contentDOM: HTMLTableSectionElement;

  view: EditorView;

  editor?: Editor;

  getPos: (() => number | undefined) | Record<string, any>;

  constructor(
    node: ProseMirrorNode,
    cellMinWidth: number,
    view: EditorView,
    getPosOrAttrs?: (() => number | undefined) | Record<string, any>,
    editor?: Editor,
  ) {
    this.node = node;
    this.cellMinWidth = cellMinWidth;
    this.view = view;
    this.getPos = getPosOrAttrs ?? (() => undefined);
    this.editor = editor ?? (view as any).editor ?? ((view.dom as any)?.editor as Editor);
    this.dom = document.createElement('div');
    this.dom.className = 'tableWrapper tiptap-widget';
    this.table = this.dom.appendChild(document.createElement('table'));

    // Apply user styles to the table element
    if (node.attrs['style']) {
      this.table.style.cssText = node.attrs['style'];
    }

    if (node.attrs['noOuterBorder']) {
      this.table.setAttribute('data-no-outer-border', '');
    } else {
      this.table.removeAttribute('data-no-outer-border');
    }

    if (node.attrs['noVerticalBorder']) {
      this.table.setAttribute('data-no-vertical-border', '');
    } else if (node.attrs['noBorders']) {
      this.table.setAttribute('data-no-borders', '');
    } else {
      this.table.removeAttribute('data-no-vertical-border');
    }

    // Insert Paragraph Before button
    const insertBeforeBtn = document.createElement('button');
    insertBeforeBtn.type = 'button';
    insertBeforeBtn.classList.add('insert-paragraph-btn', 'insert-paragraph-before');
    insertBeforeBtn.innerHTML =
      '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M11 9l1.42 1.42L8.83 14H18V7h2v9H8.83l3.59 3.58L11 21l-6-6 6-6z"/></svg>';
    insertBeforeBtn.title = 'Inserir parágrafo antes';
    insertBeforeBtn.setAttribute('aria-label', 'Inserir parágrafo antes');

    // Insert Paragraph After button
    const insertAfterBtn = document.createElement('button');
    insertAfterBtn.type = 'button';
    insertAfterBtn.classList.add('insert-paragraph-btn', 'insert-paragraph-after');
    insertAfterBtn.innerHTML =
      '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M11 9l1.42 1.42L8.83 14H18V7h2v9H8.83l3.59 3.58L11 21l-6-6 6-6z"/></svg>';
    insertAfterBtn.title = 'Inserir parágrafo após';
    insertAfterBtn.setAttribute('aria-label', 'Inserir parágrafo após');

    const bindButton = (btn: HTMLButtonElement, where: 'before' | 'after') => {
      let lastTrigger = 0;
      const trigger = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        const now = Date.now();
        if (now - lastTrigger < 300) return;
        lastTrigger = now;
        this.insertParagraph(where);
      };

      btn.addEventListener('mousedown', trigger);
      btn.addEventListener('click', trigger);
    };

    bindButton(insertBeforeBtn, 'before');
    bindButton(insertAfterBtn, 'after');

    this.dom.appendChild(insertBeforeBtn);
    this.dom.appendChild(insertAfterBtn);

    this.colgroup = this.table.appendChild(document.createElement('colgroup'));
    updateColumns(node, this.colgroup, this.table, cellMinWidth);
    this.contentDOM = this.table.appendChild(document.createElement('tbody'));
  }

  selectNode() {
    this.dom.classList.add('ex-selected');
  }

  deselectNode() {
    this.dom.classList.remove('ex-selected');
  }

  update(node: ProseMirrorNode) {
    if (node.type !== this.node.type) {
      return false;
    }

    this.node = node;

    if (node.attrs['noOuterBorder']) {
      this.table.setAttribute('data-no-outer-border', '');
    } else {
      this.table.removeAttribute('data-no-outer-border');
    }

    if (node.attrs['noBorders']) {
      this.table.setAttribute('data-no-borders', '');
    } else {
      this.table.removeAttribute('data-no-borders');
    }

    if (node.attrs['noVerticalBorder']) {
      this.table.setAttribute('data-no-vertical-border', '');
    } else {
      this.table.removeAttribute('data-no-vertical-border');
    }

    const pluginState = columnResizingPluginKey.getState(this.view.state);
    const isLastColumn = (pluginState as any)?.lastResizeWasLastColumn;

    updateColumns(node, this.colgroup, this.table, this.cellMinWidth, undefined, isLastColumn);

    return true;
  }

  ignoreMutation(mutation: ViewMutationRecord) {
    const target = mutation.target as Node;
    const isInsideWrapper = this.dom.contains(target);
    const isInsideContent = this.contentDOM.contains(target);

    if (isInsideWrapper && !isInsideContent) {
      if (
        mutation.type === 'attributes' ||
        mutation.type === 'childList' ||
        mutation.type === 'characterData'
      ) {
        return true;
      }
    }

    return false;
  }

  resolvePos(): number | undefined {
    if (typeof this.getPos === 'function') {
      const pos = this.getPos();
      if (typeof pos === 'number') {
        return pos;
      }
    }

    // Fallback 1: Resolve position using view.posAtDOM
    try {
      const posAtDom = this.view.posAtDOM(this.dom, 0);
      if (typeof posAtDom === 'number') {
        const $pos = this.view.state.doc.resolve(posAtDom);
        for (let d = $pos.depth; d >= 0; d--) {
          if ($pos.node(d).type.name === 'table') {
            return $pos.before(d);
          }
        }
      }
    } catch {
      // ignore
    }

    // Fallback 2: Search for this table node in document state
    let foundPos: number | undefined;
    this.view.state.doc.descendants((child, pos) => {
      if (child === this.node) {
        foundPos = pos;
        return false;
      }
      return true;
    });

    return foundPos;
  }

  insertParagraph(where: 'before' | 'after') {
    const pos = this.resolvePos();
    if (pos === undefined || pos === null) return;

    const editor =
      this.editor ?? (this.view as any).editor ?? ((this.view.dom as any)?.editor as Editor);

    if (!editor) return;

    // Use current table node in document state for accurate nodeSize
    const currentTable = this.view.state.doc.nodeAt(pos) || this.node;

    insertAdjacentParagraph({
      editor,
      pos,
      nodeSize: currentTable.nodeSize,
      where,
    });
  }
}
