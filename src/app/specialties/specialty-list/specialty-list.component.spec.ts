import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Specialty} from '../specialty';
import {SpecialtyService} from '../specialty.service';
import {SpecialtyListComponent} from './specialty-list.component';

const MOCK: Specialty[] = [{id: 1, name: 'Radiology'}, {id: 2, name: 'Surgery'}];

describe('SpecialtyListComponent', () => {
  let fixture: ComponentFixture<SpecialtyListComponent>;
  let component: SpecialtyListComponent;
  let specService: { getSpecialties: ReturnType<typeof vi.fn>; deleteSpecialty: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    specService = {
      getSpecialties: vi.fn().mockReturnValue(of(MOCK)),
      deleteSpecialty: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SpecialtyListComponent],
      providers: [
        {provide: SpecialtyService, useValue: specService},
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialtyListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('loads specialties on init', () => {
    expect(component.specialties()).toEqual(MOCK);
    expect(component.isSpecialitiesDataReceived()).toBe(true);
  });

  it('deleteSpecialty() removes specialty from list', () => {
    specService.deleteSpecialty.mockReturnValue(of(200));
    component.deleteSpecialty(MOCK[0]);
    expect(component.specialties()).toEqual([MOCK[1]]);
  });

  it('deleteSpecialty() sets errorMessage on error', () => {
    specService.deleteSpecialty.mockReturnValue(throwError(() => 'Error'));
    component.deleteSpecialty(MOCK[0]);
    expect(component.errorMessage).toBe('Error');
  });

  it('onNewSpecialty() appends specialty and closes insert form', () => {
    component.showAddSpecialtyComponent(); // open form first (isInsert = true)
    const newSpec: Specialty = {id: 3, name: 'Dentistry'};
    component.onNewSpecialty(newSpec);
    expect(component.specialties()).toContain(newSpec);
    expect(component.isInsert()).toBe(false);
  });

  it('showAddSpecialtyComponent() toggles isInsert', () => {
    component.showAddSpecialtyComponent();
    expect(component.isInsert()).toBe(true);
    component.showAddSpecialtyComponent();
    expect(component.isInsert()).toBe(false);
  });

  it('showEditSpecialtyComponent() navigates to edit', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.showEditSpecialtyComponent(MOCK[0]);
    expect(spy).toHaveBeenCalledWith(['/specialties', '1', 'edit']);
  });

  it('gotoHome() navigates to /welcome', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.gotoHome();
    expect(spy).toHaveBeenCalledWith(['/welcome']);
  });
});
