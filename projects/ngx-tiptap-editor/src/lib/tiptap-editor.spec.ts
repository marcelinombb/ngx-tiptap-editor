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
});
