import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Specialty} from '../../specialties/specialty';
import {SpecialtyService} from '../../specialties/specialty.service';
import {Vet} from '../vet';
import {VetService} from '../vet.service';
import {VetAddComponent} from './vet-add.component';

const MOCK_SPECS: Specialty[] = [{id: 1, name: 'Radiology'}, {id: 2, name: 'Surgery'}];
const MOCK_VET: Vet = {id: 1, firstName: 'Alice', lastName: 'Smith', specialties: [MOCK_SPECS[0]]};

describe('VetAddComponent', () => {
  let fixture: ComponentFixture<VetAddComponent>;
  let component: VetAddComponent;
  let vetService: { addVet: ReturnType<typeof vi.fn> };
  let specialtyService: { getSpecialties: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    vetService = {addVet: vi.fn()};
    specialtyService = {getSpecialties: vi.fn().mockReturnValue(of(MOCK_SPECS))};

    await TestBed.configureTestingModule({
      imports: [VetAddComponent],
      providers: [
        {provide: VetService, useValue: vetService},
        {provide: SpecialtyService, useValue: specialtyService},
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VetAddComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('loads specialties on init', () => {
    expect(component.specialtiesList()).toEqual(MOCK_SPECS);
  });

  it('form is invalid when empty', () => expect(component.form.invalid).toBe(true));

  it('compareSpecFn returns true for same id', () => {
    expect(component.compareSpecFn(MOCK_SPECS[0], MOCK_SPECS[0])).toBe(true);
  });

  it('compareSpecFn returns false for different ids', () => {
    expect(component.compareSpecFn(MOCK_SPECS[0], MOCK_SPECS[1])).toBe(false);
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.firstNameCtrl.setValue('Alice');
      component.lastNameCtrl.setValue('Smith');
      component.specialtiesCtrl.setValue([MOCK_SPECS[0]]);
    });

    it('calls addVet with form data', () => {
      vetService.addVet.mockReturnValue(of(MOCK_VET));
      component.onSubmit();
      expect(vetService.addVet).toHaveBeenCalledWith(
        expect.objectContaining({firstName: 'Alice', lastName: 'Smith'})
      );
    });

    it('navigates to /vets on success', () => {
      vetService.addVet.mockReturnValue(of(MOCK_VET));
      const spy = vi.spyOn(router, 'navigate');
      component.onSubmit();
      expect(spy).toHaveBeenCalledWith(['/vets']);
    });

    it('sets errorMessage on error', () => {
      vetService.addVet.mockReturnValue(throwError(() => 'Error'));
      component.onSubmit();
      expect(component.errorMessage()).toBe('Error');
    });
  });
});
