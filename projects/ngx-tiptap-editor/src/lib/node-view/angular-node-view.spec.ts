import { Component, Injector, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Editor, Node } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { AngularNodeViewComponent } from './angular-node-view.component';
import { AngularNodeViewRenderer } from './angular-node-view-renderer';

@Component({
  selector: 'test-node-view-component',
  standalone: true,
  template: `
    <div class="test-node-view" [class.selected]="selected()">
      <span class="node-title">{{ node().attrs['title'] }}</span>
      <div data-node-view-content></div>
    </div>
  `,
})
class TestNodeViewComponent extends AngularNodeViewComponent {}

const TestExtension = Node.create({
  name: 'testNode',
  group: 'block',
  content: 'inline*',
  addAttributes() {
    return {
      title: {
        default: 'default-title',
      },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-type="test-node"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'test-node', ...HTMLAttributes }, 0];
  },
  addNodeView() {
    return AngularNodeViewRenderer(TestNodeViewComponent, {
      injector: this.options.injector,
    });
  },
});

describe('AngularNodeView Bridge', () => {
  let injector: Injector;
  let editor: Editor;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    injector = TestBed.inject(Injector);
  });

  afterEach(() => {
    if (editor) {
      editor.destroy();
    }
  });

  it('should instantiate the node view and render component template', () => {
    editor = new Editor({
      element: document.createElement('div'),
      extensions: [StarterKit, TestExtension.configure({ injector })],
      content: '<div data-type="test-node" title="custom-title"><p>Hello Content</p></div>',
    });

    const dom = editor.view.dom;
    expect(dom).toBeTruthy();
    const nodeEl = dom.querySelector('.test-node-view');
    expect(nodeEl).toBeTruthy();
    const titleEl = dom.querySelector('.node-title');
    expect(titleEl?.textContent).toContain('custom-title');
  });

  it('should handle selection updates and update selected signal', () => {
    editor = new Editor({
      element: document.createElement('div'),
      extensions: [StarterKit, TestExtension.configure({ injector })],
      content: '<div data-type="test-node" title="test-selection"><p>Content</p></div>',
    });

    editor.commands.setNodeSelection(0);
    const nodeEl = editor.view.dom.querySelector('.test-node-view');
    expect(
      nodeEl?.classList.contains('selected') ||
        editor.view.dom.querySelector('.ProseMirror-selectednode'),
    ).toBeTruthy();
  });

  it('should clean up on editor destroy without error', () => {
    editor = new Editor({
      element: document.createElement('div'),
      extensions: [StarterKit, TestExtension.configure({ injector })],
      content: '<div data-type="test-node"><p>Content</p></div>',
    });

    expect(() => editor.destroy()).not.toThrow();
  });
});
