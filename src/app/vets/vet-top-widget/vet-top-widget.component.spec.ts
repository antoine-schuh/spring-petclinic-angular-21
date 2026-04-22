import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of, throwError} from 'rxjs';
import {VetTop} from '../vet-top';
import {VetService} from '../vet.service';
import {VetTopWidgetComponent} from './vet-top-widget.component';

const MOCK: VetTop[] = [
  {id: 1, firstName: 'Alice', lastName: 'Smith', visitCount: 10, distinctPetCount: 7},
  {id: 2, firstName: 'Bob', lastName: 'Jones', visitCount: 8, distinctPetCount: 5},
];

describe('VetTopWidgetComponent', () => {
  let fixture: ComponentFixture<VetTopWidgetComponent>;
  let component: VetTopWidgetComponent;
  let vetService: { getTopVets: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vetService = {
      getTopVets: vi.fn().mockReturnValue(of(MOCK)),
    };

    await TestBed.configureTestingModule({
      imports: [VetTopWidgetComponent],
      providers: [
        {provide: VetService, useValue: vetService},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VetTopWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('loads top vets on init', () => {
    expect(component.topVets()).toEqual(MOCK);
  });

  it('renders a row for each top vet', () => {
    const rows: NodeListOf<HTMLTableRowElement> = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(MOCK.length);
  });

  it('displays vet name, visit count and distinct pet count', () => {
    const cells: NodeListOf<HTMLTableCellElement> = fixture.nativeElement.querySelectorAll('tbody tr:first-child td');
    expect(cells[0].textContent?.trim()).toBe('Alice Smith');
    expect(cells[1].textContent?.trim()).toBe('10');
    expect(cells[2].textContent?.trim()).toBe('7');
  });

  it('renders nothing when top vets list is empty', async () => {
    vetService.getTopVets.mockReturnValue(of([]));
    const emptyFixture = TestBed.createComponent(VetTopWidgetComponent);
    emptyFixture.detectChanges();
    const widget = emptyFixture.nativeElement.querySelector('.vet-top-widget');
    expect(widget).toBeNull();
  });

  it('leaves topVets empty on API error', () => {
    vetService.getTopVets.mockReturnValue(throwError(() => 'Server error'));
    const errorFixture = TestBed.createComponent(VetTopWidgetComponent);
    errorFixture.detectChanges();
    expect(errorFixture.componentInstance.topVets()).toEqual([]);
  });
});
