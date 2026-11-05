import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableGridComponent } from './table-grid.component';

describe('TableGridComponent', () => {
  let component: TableGridComponent;
  let fixture: ComponentFixture<TableGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableGridComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TableGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with initial dimensions', () => {
    expect(component).toBeTruthy();
    expect(component.rows.length).toBe(10);
    expect(component.cols.length).toBe(10);
    expect(component.hoveredRows()).toBe(0);
    expect(component.hoveredCols()).toBe(0);
  });

  it('should update hovered dimensions on onHover and reset on resetHover', () => {
    component.onHover(3, 4);
    expect(component.hoveredRows()).toBe(3);
    expect(component.hoveredCols()).toBe(4);

    component.resetHover();
    expect(component.hoveredRows()).toBe(0);
    expect(component.hoveredCols()).toBe(0);
  });

  it('should emit onSelect when selectGrid is clicked', () => {
    let selected: { rows: number; cols: number } | null = null;
    component.onSelect.subscribe((val) => {
      selected = val;
    });

    component.selectGrid(3, 3);
    expect(selected).toEqual({ rows: 3, cols: 3 } as any);
  });
});
