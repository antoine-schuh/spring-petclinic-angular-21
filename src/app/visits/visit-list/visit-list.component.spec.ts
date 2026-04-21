import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Visit} from '../visit';
import {VisitService} from '../visit.service';
import {VisitListComponent} from './visit-list.component';

const MOCK: Visit[] = [
  {id: 1, date: '2024-01-01', description: 'Check-up', petId: 1, pet: null},
  {id: 2, date: '2024-02-01', description: 'Vaccination', petId: 1, pet: null},
];

describe('VisitListComponent', () => {
  let fixture: ComponentFixture<VisitListComponent>;
  let component: VisitListComponent;
  let visitService: { deleteVisit: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    visitService = {deleteVisit: vi.fn()};

    await TestBed.configureTestingModule({
      imports: [VisitListComponent],
      providers: [
        {provide: VisitService, useValue: visitService},
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VisitListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('visits', MOCK);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('reflects visits from input', () => {
    expect(component.localVisits()).toEqual(MOCK);
    expect(component.noVisits()).toBe(false);
  });

  it('noVisits() is true when visits is empty', () => {
    fixture.componentRef.setInput('visits', []);
    fixture.detectChanges();
    expect(component.noVisits()).toBe(true);
  });

  it('editVisit() navigates to edit page', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.editVisit(MOCK[0]);
    expect(spy).toHaveBeenCalledWith(['/visits', 1, 'edit']);
  });

  it('deleteVisit() removes visit from localVisits', () => {
    visitService.deleteVisit.mockReturnValue(of(null));
    component.deleteVisit(MOCK[0]);
    expect(component.localVisits()).toEqual([MOCK[1]]);
  });

  it('deleteVisit() sets errorMessage on error', () => {
    visitService.deleteVisit.mockReturnValue(throwError(() => 'Error'));
    component.deleteVisit(MOCK[0]);
    expect(component.errorMessage).toBe('Error');
  });
});
