import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, provideRouter, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Specialty} from '../../specialties/specialty';
import {SpecialtyService} from '../../specialties/specialty.service';
import {Vet} from '../vet';
import {VetService} from '../vet.service';
import {VetEditComponent} from './vet-edit.component';

const MOCK_SPECS: Specialty[] = [{id: 1, name: 'Radiology'}, {id: 2, name: 'Surgery'}];
const MOCK_VET: Vet = {id: 1, firstName: 'Alice', lastName: 'Smith', specialties: [MOCK_SPECS[0]]};

describe('VetEditComponent', () => {
  let fixture: ComponentFixture<VetEditComponent>;
  let component: VetEditComponent;
  let vetService: { updateVet: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    vetService = {updateVet: vi.fn()};

    await TestBed.configureTestingModule({
      imports: [VetEditComponent],
      providers: [
        {provide: VetService, useValue: vetService},
        {provide: SpecialtyService, useValue: {}},
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {id: '1'},
              data: {vet: MOCK_VET, specs: MOCK_SPECS},
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VetEditComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('loads vet and specialties from route data on init', () => {
    expect(component.vet).toEqual(MOCK_VET);
    expect(component.specList).toEqual(MOCK_SPECS);
  });

  it('patches form with vet values on init', () => {
    expect(component.firstNameCtrl.value).toBe('Alice');
    expect(component.lastNameCtrl.value).toBe('Smith');
  });

  it('compareSpecFn returns true for same id', () => {
    expect(component.compareSpecFn(MOCK_SPECS[0], MOCK_SPECS[0])).toBe(true);
  });

  it('compareSpecFn returns false for different ids', () => {
    expect(component.compareSpecFn(MOCK_SPECS[0], MOCK_SPECS[1])).toBe(false);
  });

  describe('onSubmit', () => {
    it('calls updateVet with vet data', () => {
      vetService.updateVet.mockReturnValue(of(MOCK_VET));
      component.onSubmit(MOCK_VET);
      expect(vetService.updateVet).toHaveBeenCalledWith('1', MOCK_VET);
    });

    it('navigates to /vets on success', () => {
      vetService.updateVet.mockReturnValue(of(MOCK_VET));
      const spy = vi.spyOn(router, 'navigate');
      component.onSubmit(MOCK_VET);
      expect(spy).toHaveBeenCalledWith(['/vets']);
    });

    it('sets errorMessage on error', () => {
      vetService.updateVet.mockReturnValue(throwError(() => 'Error'));
      component.onSubmit(MOCK_VET);
      expect(component.errorMessage()).toBe('Error');
    });
  });

  it('gotoVetList() navigates to /vets', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.gotoVetList();
    expect(spy).toHaveBeenCalledWith(['/vets']);
  });
});
