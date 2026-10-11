import {
  Component,
  ElementRef,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Injector,
  inject,
  AfterViewInit,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Editor } from '@tiptap/core';
import { EditorToolbarComponent } from './components/editor-toolbar.component';
import { KatexFloatingMenuComponent } from './components/floating-menus/katex-floating-menu.component';
import { ImageFloatingMenuComponent } from './components/floating-menus/image-floating-menu.component';
import { TableFloatingMenuComponent } from './components/floating-menus/table-floating-menu.component';
import { AnswerBoxFloatingMenuComponent } from './components/floating-menus/answer-box-floating-menu.component';
import { ExtensionFactory } from './extension-factory';
import { EditorDropdownService } from './components/editor-dropdown.component';
import { KatexMenuService } from './services/katex-menu.service';
import { SpellCheckerConfig } from './extensions/spell-checker/spell-checker';

export interface EditorExtensionsConfig {
  spellChecker?: SpellCheckerConfig;
  proxyUrl?: string;
}

@Component({
  selector: 'tiptap-editor, exitus-tiptap-editor, ngx-tiptap-editor',
  imports: [
    EditorToolbarComponent,
    KatexFloatingMenuComponent,
    ImageFloatingMenuComponent,
    TableFloatingMenuComponent,
    AnswerBoxFloatingMenuComponent,
  ],
  template: `
    <div class="tiptap-editor exitus-tiptap-editor ngx-tiptap-editor">
      @if (editorInstance) {
        <editor-toolbar [editor]="editorInstance"></editor-toolbar>
        <katex-floating-menu [editor]="editorInstance"></katex-floating-menu>
        <image-floating-menu [editor]="editorInstance"></image-floating-menu>
        <table-floating-menu [editor]="editorInstance"></table-floating-menu>
        <answer-box-floating-menu [editor]="editorInstance"></answer-box-floating-menu>
      }
      <div class="editor-scroller">
        <div #editor class="editor-main" spellcheck="false"></div>
      </div>
    </div>
  `,
  styleUrls: ['./tiptap-editor.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    EditorDropdownService,
    KatexMenuService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxTiptapEditor),
      multi: true,
    },
  ],
})
export class NgxTiptapEditor implements ControlValueAccessor, OnDestroy, AfterViewInit {
  private editorElement = viewChild.required<ElementRef>('editor');
  private editor = signal<Editor | null>(null);
  private injector = inject(Injector);

  editable = input<boolean>(true);
  content = input<string>(``);
  extensionsConfig = input<EditorExtensionsConfig>();

  onContentChange = output<string>();
  onEditorReady = output<Editor>();

  private onChange: (value: string) => void = () => {
    // noop
  };
  private onTouched: () => void = () => {
    // noop
  };
  private pendingValue: string | null = null;
  private isDisabled = false;

  setContent(newContent: string) {
    if (this.editor()) {
      this.editor()!.commands.setContent(newContent);
    } else {
      this.pendingValue = newContent;
    }
  }

  get editorInstance(): Editor | null {
    return this.editor();
  }

  ngAfterViewInit() {
    this.initializeEditor();
  }

  // --- ControlValueAccessor Implementation ---

  writeValue(value: string | null): void {
    const stringVal = value ?? '';
    const currentEditor = this.editor();
    if (currentEditor) {
      if (currentEditor.getHTML() !== stringVal) {
        currentEditor.commands.setContent(stringVal, { emitUpdate: false });
      }
    } else {
      this.pendingValue = stringVal;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    const currentEditor = this.editor();
    if (currentEditor) {
      currentEditor.setEditable(!isDisabled);
    }
  }

  private initializeEditor() {
    const initialContent = this.pendingValue !== null ? this.pendingValue : this.content();

    const newEditor = new Editor({
      element: this.editorElement().nativeElement,
      editable: this.isDisabled ? false : this.editable(),
      content: initialContent,
      extensions: this.getExtensions(),
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        this.onChange(html);
        this.onContentChange.emit(html);
      },
      onBlur: () => {
        this.onTouched();
      },
      onCreate: ({ editor }) => {
        this.onEditorReady.emit(editor);
      },
    });

    this.editor.set(newEditor);
  }

  private getExtensions() {
    return ExtensionFactory.createExtensions(this.injector, this.extensionsConfig());
  }

  ngOnDestroy(): void {
    this.editor()?.destroy();
  }
}

/** Backward compatibility alias */
export { NgxTiptapEditor as ExitusTiptapEditor };
