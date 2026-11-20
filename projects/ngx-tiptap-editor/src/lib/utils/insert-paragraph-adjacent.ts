import { Editor } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';

export interface InsertAdjacentParagraphOptions {
  editor: Editor;
  pos: number;
  nodeSize: number;
  where: 'before' | 'after';
}

/**
 * Safely inserts an empty paragraph before or after a block node,
 * placing the text cursor cleanly inside the newly created paragraph.
 */
export function insertAdjacentParagraph({
  editor,
  pos,
  nodeSize,
  where,
}: InsertAdjacentParagraphOptions): boolean {
  if (!editor || !editor.view || editor.isDestroyed) {
    return false;
  }

  const { state, view } = editor;
  const { tr, schema } = state;
  const paragraphType = schema.nodes['paragraph'];
  if (!paragraphType) {
    return false;
  }

  const paragraphNode = paragraphType.createAndFill();
  if (!paragraphNode) {
    return false;
  }

  // Determine insertion position:
  // - 'before': at the node's starting position (pos)
  // - 'after': immediately after the node (pos + nodeSize)
  const insertPos = where === 'before' ? pos : pos + nodeSize;

  // Insert the paragraph node
  tr.insert(insertPos, paragraphNode);

  // Position cursor inside the new paragraph:
  // The newly inserted paragraph node starts at `insertPos`.
  // The inside of the paragraph (where text can be written) is at `insertPos + 1`.
  const targetCursorPos = insertPos + 1;

  try {
    const selection = TextSelection.create(tr.doc, targetCursorPos);
    tr.setSelection(selection);
  } catch {
    // Fallback in case of unexpected schema nesting: use nearest valid text position
    const resolved = tr.doc.resolve(targetCursorPos);
    tr.setSelection(TextSelection.near(resolved));
  }

  tr.scrollIntoView();
  view.dispatch(tr);
  view.focus();

  return true;
}
