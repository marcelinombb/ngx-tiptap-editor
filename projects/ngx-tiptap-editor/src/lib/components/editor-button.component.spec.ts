import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorButtonComponent } from './editor-button.component';

describe('EditorButtonComponent', () => {
  let component: EditorButtonComponent;
  let fixture: ComponentFixture<EditorButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorButtonComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Negrito');
    fixture.detectChanges();
  });

  it('should create and set aria attributes', () => {
    expect(component).toBeTruthy();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.getAttribute('title')).toBe('Negrito');
    expect(btn.getAttribute('aria-label')).toBe('Negrito');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
  });

  it('should compute active classes and aria-pressed when active is true', () => {
    fixture.componentRef.setInput('active', true);
    fixture.componentRef.setInput('icon', 'bold');
    fixture.detectChanges();

    const classes = component.buttonClasses();
    expect(classes['ex-button-active']).toBeTrue();
    expect(classes['btn-bold']).toBeTrue();

    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  it('should emit onClick when clicked and not disabled', () => {
    let clicked = false;
    component.onClick.subscribe(() => {
      clicked = true;
    });

    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(clicked).toBeTrue();
  });
});
