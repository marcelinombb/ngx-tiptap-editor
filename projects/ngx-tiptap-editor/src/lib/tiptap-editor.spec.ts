import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxTiptapEditor } from './tiptap-editor';

@Component({
  standalone: true,
  imports: [NgxTiptapEditor, ReactiveFormsModule],
  template: `<tiptap-editor [formControl]="control"></tiptap-editor>`,
})
class TestHostComponent {
  control = new FormControl('<p>Form Initial</p>');
}

describe('NgxTiptapEditor', () => {
  let component: NgxTiptapEditor;
  let fixture: ComponentFixture<NgxTiptapEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxTiptapEditor, TestHostComponent],
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

  describe('ControlValueAccessor', () => {
    it('should write value to editor when editor is initialized', () => {
      component.writeValue('<p>Updated via CVA</p>');
      expect(component.editorInstance?.getHTML()).toContain('Updated via CVA');
    });

    it('should call registered onChange when content updates', () => {
      const changeSpy = jasmine.createSpy('onChange');
      component.registerOnChange(changeSpy);

      component.editorInstance?.commands.setContent('<p>New content from user</p>');
      expect(changeSpy).toHaveBeenCalledWith(jasmine.stringMatching('New content from user'));
    });

    it('should call registered onTouched on editor blur', () => {
      const touchSpy = jasmine.createSpy('onTouched');
      component.registerOnTouched(touchSpy);

      // Trigger blur event on editor instance
      component.editorInstance?.emit('blur', {
        event: new FocusEvent('blur'),
        editor: component.editorInstance,
        transaction: component.editorInstance.state.tr,
      });

      expect(touchSpy).toHaveBeenCalled();
    });

    it('should disable and enable editor via setDisabledState', () => {
      component.setDisabledState(true);
      expect(component.editorInstance?.isEditable).toBeFalse();

      component.setDisabledState(false);
      expect(component.editorInstance?.isEditable).toBeTrue();
    });

    it('should integrate seamlessly with ReactiveFormsModule FormControl', () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const hostComp = hostFixture.componentInstance;
      const editorComponent = hostFixture.debugElement.children[0]
        .componentInstance as NgxTiptapEditor;

      expect(editorComponent.editorInstance?.getHTML()).toContain('Form Initial');

      hostComp.control.setValue('<p>Changed by Control</p>');
      expect(editorComponent.editorInstance?.getHTML()).toContain('Changed by Control');

      editorComponent.editorInstance?.commands.setContent('<p>Changed by Editor</p>');
      expect(hostComp.control.value).toContain('Changed by Editor');
    });
  });
});
