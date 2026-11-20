import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { insertAdjacentParagraph } from './insert-paragraph-adjacent';

describe('insertAdjacentParagraph', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      extensions: [StarterKit],
      content: '<blockquote><p>Quote Block</p></blockquote>',
    });
  });

  afterEach(() => {
    editor.destroy();
  });

  it('should return false if editor is destroyed', () => {
    editor.destroy();
    const result = insertAdjacentParagraph({
      editor,
      pos: 0,
      nodeSize: 10,
      where: 'before',
    });
    expect(result).toBeFalse();
  });

  it('should insert a paragraph before the block node and focus inside it', () => {
    // In our doc, blockquote is at pos 0
    const quoteNode = editor.state.doc.child(0);
    const nodeSize = quoteNode.nodeSize;

    const result = insertAdjacentParagraph({
      editor,
      pos: 0,
      nodeSize,
      where: 'before',
    });

    expect(result).toBeTrue();

    // First node should now be a paragraph
    const firstNode = editor.state.doc.child(0);
    expect(firstNode.type.name).toBe('paragraph');

    // Selection should be inside the newly created paragraph (pos 1)
    const selection = editor.state.selection;
    expect(selection.from).toBe(1);
    expect(selection.to).toBe(1);

    // Second node should be the blockquote
    const secondNode = editor.state.doc.child(1);
    expect(secondNode.type.name).toBe('blockquote');
  });

  it('should insert a paragraph after the block node and focus inside it', () => {
    // In our doc, blockquote is at pos 0
    const quoteNode = editor.state.doc.child(0);
    const nodeSize = quoteNode.nodeSize;

    const result = insertAdjacentParagraph({
      editor,
      pos: 0,
      nodeSize,
      where: 'after',
    });

    expect(result).toBeTrue();

    // First node remains the blockquote
    const firstNode = editor.state.doc.child(0);
    expect(firstNode.type.name).toBe('blockquote');

    // Second node should be the newly created paragraph
    const secondNode = editor.state.doc.child(1);
    expect(secondNode.type.name).toBe('paragraph');

    // Selection should be inside the newly created paragraph (nodeSize + 1)
    const selection = editor.state.selection;
    expect(selection.from).toBe(nodeSize + 1);
    expect(selection.to).toBe(nodeSize + 1);
  });
});
