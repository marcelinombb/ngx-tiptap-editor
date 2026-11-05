import { provideZonelessChangeDetection, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Figure } from './Figure';
import { Figcaption } from './Figcaption';
import { Image } from './image';
import { findFigureNode } from '../../utils/tiptap-selection';

describe('Figure Extension', () => {
  let editor: Editor;
  let injector: Injector;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    injector = TestBed.inject(Injector);

    editor = new Editor({
      extensions: [
        StarterKit,
        Image.configure({ inline: false, allowBase64: true }),
        Figcaption,
        Figure.configure({ injector }),
      ],
      content: '<figure><img src="https://example.com/test.png" /></figure>',
    });
  });

  afterEach(() => {
    editor.destroy();
  });

  it('deve inicializar o schema com nó figure', () => {
    expect(editor.schema.nodes['figure']).toBeDefined();
    expect(editor.schema.nodes['figcaption']).toBeDefined();
  });

  it('deve carregar o conteúdo inicial como um nó figure', () => {
    const html = editor.getHTML();
    expect(html).toContain('<figure');
    expect(html).toContain('img src="https://example.com/test.png"');
  });

  it('deve encontrar o nó figure através de findFigureNode quando selecionado', () => {
    editor.commands.setNodeSelection(0);
    const figureInfo = findFigureNode(editor.state);
    expect(figureInfo).toBeDefined();
    expect(figureInfo?.node.type.name).toBe('figure');
  });

  it('deve aplicar largura ao nó figure com setImageWidth', () => {
    editor.commands.setNodeSelection(0);
    editor.commands.setImageWidth(350);

    const figureInfo = findFigureNode(editor.state);
    expect(figureInfo?.node.attrs['width']).toBe(350);
  });

  it('deve alterar e verificar o alinhamento com setImageAlignment e hasAlignment', () => {
    editor.commands.setNodeSelection(0);

    expect(editor.commands.hasAlignment('middle')).toBeTrue();

    editor.commands.setImageAlignment('right');
    expect(editor.commands.hasAlignment('right')).toBeTrue();
    expect(editor.commands.hasAlignment('middle')).toBeFalse();

    editor.commands.setImageAlignment('left');
    expect(editor.commands.hasAlignment('left')).toBeTrue();
    expect(editor.commands.hasAlignment('right')).toBeFalse();
  });

  it('deve alternar a figcaption com toggleFigcaption', () => {
    editor.commands.setNodeSelection(0);

    let figureInfo = findFigureNode(editor.state);
    expect(figureInfo?.node.childCount).toBe(1); // apenas img

    editor.commands.toggleFigcaption();

    editor.commands.setNodeSelection(0);
    figureInfo = findFigureNode(editor.state);
    expect(figureInfo?.node.childCount).toBe(2); // img + figcaption
    expect(figureInfo?.node.lastChild?.type.name).toBe('figcaption');

    editor.commands.toggleFigcaption();

    editor.commands.setNodeSelection(0);
    figureInfo = findFigureNode(editor.state);
    expect(figureInfo?.node.childCount).toBe(1); // figcaption removida
  });

  it('deve armazenar e aplicar metadados de crop com setCrop e resetCrop', () => {
    editor.commands.setNodeSelection(0);

    const cropRegion = { x: 0.1, y: 0.2, width: 0.5, height: 0.6 };
    editor.commands.setCrop(cropRegion);

    let figureInfo = findFigureNode(editor.state);
    expect(figureInfo?.node.attrs['crop']).toEqual(cropRegion);

    // Child image node também deve conter os metadados de crop
    const imageChild = figureInfo?.node.firstChild;
    expect(imageChild?.attrs['crop']).toEqual(cropRegion);
    // Original src permanece inalterado
    expect(imageChild?.attrs['src']).toBe('https://example.com/test.png');

    editor.commands.resetCrop();

    figureInfo = findFigureNode(editor.state);
    expect(figureInfo?.node.attrs['crop']).toBeNull();
    expect(figureInfo?.node.firstChild?.attrs['crop']).toBeNull();
    expect(figureInfo?.node.firstChild?.attrs['src']).toBe('https://example.com/test.png');
  });

  it('deve carregar e serializar imagem com metadados de data-crop mantendo compatibilidade', () => {
    const customEditor = new Editor({
      extensions: [
        StarterKit,
        Image.configure({ inline: false, allowBase64: true }),
        Figcaption,
        Figure.configure({ injector }),
      ],
      content:
        '<figure><img src="https://example.com/photo.jpg" data-crop=\'{"x":0.2,"y":0.3,"width":0.4,"height":0.5}\' /></figure>',
    });

    const figureInfo = findFigureNode(customEditor.state);
    expect(figureInfo?.node.firstChild?.attrs['crop']).toEqual({
      x: 0.2,
      y: 0.3,
      width: 0.4,
      height: 0.5,
    });
    expect(figureInfo?.node.firstChild?.attrs['src']).toBe('https://example.com/photo.jpg');

    const html = customEditor.getHTML();
    expect(html).toContain('data-crop=');
    expect(html).toContain('https://example.com/photo.jpg');
    expect(html).toContain('object-view-box: inset(');

    customEditor.destroy();
  });

  it('deve manter compatibilidade com imagens existentes sem metadados de crop', () => {
    const standardEditor = new Editor({
      extensions: [
        StarterKit,
        Image.configure({ inline: false, allowBase64: true }),
        Figcaption,
        Figure.configure({ injector }),
      ],
      content: '<figure><img src="https://example.com/uncropped.jpg" /></figure>',
    });

    const figureInfo = findFigureNode(standardEditor.state);
    expect(figureInfo?.node.attrs['crop']).toBeNull();
    expect(figureInfo?.node.firstChild?.attrs['crop']).toBeNull();
    expect(figureInfo?.node.firstChild?.attrs['src']).toBe('https://example.com/uncropped.jpg');

    standardEditor.destroy();
  });
});
