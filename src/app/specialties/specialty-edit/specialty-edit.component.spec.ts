import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, provideRouter, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Specialty} from '../specialty';
import {SpecialtyService} from '../specialty.service';
import {SpecialtyEditComponent} from './specialty-edit.component';

const MOCK: Specialty = {id: 1, name: 'Radiology'};

describe('SpecialtyEditComponent', () => {
  let fixture: ComponentFixture<SpecialtyEditComponent>;
  let component: SpecialtyEditComponent;
  let specService: { getSpecialtyById: ReturnType<typeof vi.fn>; updateSpecialty: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    specService = {
      getSpecialtyById: vi.fn().mockReturnValue(of(MOCK)),
      updateSpecialty: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SpecialtyEditComponent],
      providers: [
        {provide: SpecialtyService, useValue: specService},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: '1'}}}},
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialtyEditComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('loads specialty and patches form on init', () => {
    expect(component.specialty()).toEqual(MOCK);
    expect(component.form.value.name).toBe('Radiology');
  });

  describe('onSubmit', () => {
    it('calls updateSpecialty', () => {
      specService.updateSpecialty.mockReturnValue(of(MOCK));
      component.onSubmit();
      expect(specService.updateSpecialty).toHaveBeenCalledWith('1', MOCK);
    });

    it('navigates to /specialties on success', () => {
      specService.updateSpecialty.mockReturnValue(of(MOCK));
      const spy = vi.spyOn(router, 'navigate');
      component.onSubmit();
      expect(spy).toHaveBeenCalledWith(['/specialties']);
    });

    it('sets errorMessage on error', () => {
      specService.updateSpecialty.mockReturnValue(throwError(() => 'Error'));
      component.onSubmit();
      expect(component.errorMessage()).toBe('Error');
    });
  });

  it('onBack() navigates to /specialties', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.onBack();
    expect(spy).toHaveBeenCalledWith(['/specialties']);
  });
});
