import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxTiptapEditor } from './tiptap-editor';

describe('NgxTiptapEditor', () => {
  let component: NgxTiptapEditor;
  let fixture: ComponentFixture<NgxTiptapEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxTiptapEditor],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxTiptapEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the editor instance', () => {
    expect(component.editorInstance).toBeTruthy();
  });

  it('should set content correctly', () => {
    const content = '<p>Hello World</p>';
    fixture.componentRef.setInput('content', content);
    component.setContent(content);
    expect(component.editorInstance?.getHTML()).toContain('Hello World');
  });

  it('should render compatibility CSS classes on editor element', () => {
    const el = fixture.nativeElement as HTMLElement;
    const editorDiv = el.querySelector('.tiptap-editor');
    expect(editorDiv).toBeTruthy();
    expect(editorDiv?.classList.contains('exitus-tiptap-editor')).toBeTrue();
    expect(editorDiv?.classList.contains('ngx-tiptap-editor')).toBeTrue();
  });
});
