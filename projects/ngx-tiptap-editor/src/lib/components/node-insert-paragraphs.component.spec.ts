import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { NodeInsertParagraphsComponent } from './node-insert-paragraphs.component';

describe('NodeInsertParagraphsComponent', () => {
  let component: NodeInsertParagraphsComponent;
  let fixture: ComponentFixture<NodeInsertParagraphsComponent>;
  let editor: Editor;

  beforeEach(async () => {
    editor = new Editor({
      extensions: [StarterKit],
      content: '<blockquote><p>Test</p></blockquote>',
    });

    await TestBed.configureTestingModule({
      imports: [NodeInsertParagraphsComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(NodeInsertParagraphsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('editor', editor);
    fixture.componentRef.setInput('getPos', () => 0);
    fixture.componentRef.setInput('node', editor.state.doc.child(0));
    fixture.detectChanges();
  });

  afterEach(() => {
    editor.destroy();
  });

  it('should create and render before and after buttons', () => {
    expect(component).toBeTruthy();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(2);

    expect(buttons[0].classList.contains('insert-paragraph-before')).toBeTrue();
    expect(buttons[1].classList.contains('insert-paragraph-after')).toBeTrue();
  });

  it('should insert a paragraph before and prevent default on mousedown', () => {
    const beforeBtn = fixture.nativeElement.querySelector(
      '.insert-paragraph-before',
    ) as HTMLButtonElement;
    const event = new MouseEvent('mousedown', { cancelable: true, bubbles: true });
    spyOn(event, 'preventDefault').and.callThrough();
    spyOn(event, 'stopPropagation').and.callThrough();

    beforeBtn.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(editor.state.doc.child(0).type.name).toBe('paragraph');
  });

  it('should insert a paragraph after and prevent default on mousedown', () => {
    const afterBtn = fixture.nativeElement.querySelector(
      '.insert-paragraph-after',
    ) as HTMLButtonElement;
    const event = new MouseEvent('mousedown', { cancelable: true, bubbles: true });
    spyOn(event, 'preventDefault').and.callThrough();
    spyOn(event, 'stopPropagation').and.callThrough();

    afterBtn.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    // Second node should now be a paragraph
    expect(editor.state.doc.child(1).type.name).toBe('paragraph');
  });
});
