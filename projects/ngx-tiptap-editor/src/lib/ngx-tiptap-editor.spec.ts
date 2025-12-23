import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxNgxTiptapEditor } from './ngx-tiptap-editor';

describe('NgxNgxTiptapEditor', () => {
  let component: NgxNgxTiptapEditor;
  let fixture: ComponentFixture<NgxNgxTiptapEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxNgxTiptapEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxNgxTiptapEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
