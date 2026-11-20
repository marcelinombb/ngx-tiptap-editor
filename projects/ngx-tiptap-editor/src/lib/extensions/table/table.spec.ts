import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { TableExtensions, TableView, fixTableEmptyParagraphs } from './index';

describe('TableExtensions', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      extensions: [StarterKit, ...TableExtensions],
      content:
        '<table><tbody><tr><td><p>Célula 1</p></td><td><p>Célula 2</p></td></tr></tbody></table>',
    });
  });

  afterEach(() => {
    editor.destroy();
  });

  it('deve registrar nós de tabela no schema', () => {
    expect(editor.schema.nodes['table']).toBeDefined();
    expect(editor.schema.nodes['tableRow']).toBeDefined();
    expect(editor.schema.nodes['tableHeader']).toBeDefined();
    expect(editor.schema.nodes['tableCell']).toBeDefined();
  });

  it('deve fazer parse de atributos customizados de borda', () => {
    editor.commands.setContent(
      '<table data-no-outer-border data-no-vertical-border data-no-borders><tbody><tr><td><p>A</p></td></tr></tbody></table>',
    );

    const json = editor.getJSON();
    const tableNode = json.content?.find((node) => node.type === 'table');

    expect(tableNode).toBeDefined();
    expect(tableNode?.attrs?.['noOuterBorder']).toBeTrue();
    expect(tableNode?.attrs?.['noVerticalBorder']).toBeTrue();
    expect(tableNode?.attrs?.['noBorders']).toBeTrue();
  });

  it('deve inserir uma nova tabela com insertTable', () => {
    editor.commands.clearContent();
    editor.commands.insertTable({ rows: 2, cols: 2, withHeaderRow: false });

    const json = editor.getJSON();
    const tableNode = json.content?.find((node) => node.type === 'table');
    expect(tableNode).toBeDefined();
    expect(tableNode?.content?.length).toBe(2); // 2 rows
  });

  describe('fixTableEmptyParagraphs', () => {
    it('deve adicionar tag br em parágrafos de células vazias', () => {
      const inputHtml =
        '<table><tbody><tr><td><p></p></td><td><p>Preenchido</p></td></tr></tbody></table>';
      const fixed = fixTableEmptyParagraphs(inputHtml);

      expect(fixed).toContain('<td><p><br></p></td>');
      expect(fixed).toContain('<td><p>Preenchido</p></td>');
    });

    it('não deve alterar células que já possuem conteúdo', () => {
      const inputHtml = '<table><tbody><tr><td><p>Texto</p></td></tr></tbody></table>';
      const fixed = fixTableEmptyParagraphs(inputHtml);

      expect(fixed).toContain('<td><p>Texto</p></td>');
      expect(fixed).not.toContain('<br>');
    });
  });

  describe('TableView - insertParagraph', () => {
    it('deve inserir parágrafo antes da tabela e posicionar o cursor', () => {
      const tableNode = editor.state.doc.child(0);
      const tableView = new TableView(tableNode, 25, editor.view, () => 0, editor);

      tableView.insertParagraph('before');

      // Primeiro nó agora é um parágrafo
      expect(editor.state.doc.child(0).type.name).toBe('paragraph');
      // Segundo nó é a tabela
      expect(editor.state.doc.child(1).type.name).toBe('table');
      // Cursor está dentro do parágrafo inserido
      expect(editor.state.selection.from).toBe(1);
    });

    it('deve inserir parágrafo após a tabela e posicionar o cursor', () => {
      const tableNode = editor.state.doc.child(0);
      const tableSize = tableNode.nodeSize;
      const tableView = new TableView(tableNode, 25, editor.view, () => 0, editor);

      tableView.insertParagraph('after');

      // Primeiro nó é a tabela
      expect(editor.state.doc.child(0).type.name).toBe('table');
      // Segundo nó agora é um parágrafo
      expect(editor.state.doc.child(1).type.name).toBe('paragraph');
      // Cursor está dentro do parágrafo inserido
      expect(editor.state.selection.from).toBe(tableSize + 1);
    });

    it('deve resolver a posição da tabela mesmo se getPos não for função (fallback defensivo)', () => {
      const tableNode = editor.state.doc.child(0);
      // Simula caso onde getPos é passado como objeto de atributos pelo Tiptap padrão
      const tableView = new TableView(tableNode, 25, editor.view, {} as any, editor);

      tableView.insertParagraph('before');

      expect(editor.state.doc.child(0).type.name).toBe('paragraph');
      expect(editor.state.doc.child(1).type.name).toBe('table');
    });
  });
});
