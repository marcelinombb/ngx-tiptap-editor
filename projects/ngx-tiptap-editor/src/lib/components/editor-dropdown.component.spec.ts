import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorDropdownComponent, EditorDropdownService } from './editor-dropdown.component';
import { EditorButtonComponent } from './editor-button.component';

@Component({
  standalone: true,
  imports: [EditorDropdownComponent, EditorButtonComponent],
  template: `
    <editor-dropdown icon="format" title="Formatos">
      <editor-button icon="format-h1" title="Título 1"></editor-button>
      <editor-button icon="format-h2" title="Título 2"></editor-button>
    </editor-dropdown>
  `,
})
class DropdownHostComponent {}

describe('EditorDropdownComponent', () => {
  let fixture: ComponentFixture<DropdownHostComponent>;
  let dropdownService: EditorDropdownService;

  beforeEach(async () => {
    dropdownService = new EditorDropdownService();

    await TestBed.configureTestingModule({
      imports: [DropdownHostComponent, EditorDropdownComponent, EditorButtonComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: EditorDropdownService, useValue: dropdownService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownHostComponent);
    fixture.detectChanges();
  });

  it('should create and toggle open state', () => {
    const dropdown = fixture.debugElement.children[0].componentInstance as EditorDropdownComponent;
    expect(dropdown.open()).toBeFalse();

    dropdown.toggle();
    expect(dropdown.open()).toBeTrue();

    dropdown.clickOutside();
    expect(dropdown.open()).toBeFalse();
  });

  it('should react to dropdown service state changes', () => {
    const dropdown = fixture.debugElement.children[0].componentInstance as EditorDropdownComponent;
    dropdown.open.set(true);

    dropdownService.setOpenState(false);
    expect(dropdown.open()).toBeFalse();
  });
});
