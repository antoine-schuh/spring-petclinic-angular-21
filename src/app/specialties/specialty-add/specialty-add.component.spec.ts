import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of, throwError} from 'rxjs';
import {Specialty} from '../specialty';
import {SpecialtyService} from '../specialty.service';
import {SpecialtyAddComponent} from './specialty-add.component';

const MOCK: Specialty = {id: 1, name: 'Radiology'};

describe('SpecialtyAddComponent', () => {
  let fixture: ComponentFixture<SpecialtyAddComponent>;
  let component: SpecialtyAddComponent;
  let specService: { addSpecialty: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    specService = {addSpecialty: vi.fn()};

    await TestBed.configureTestingModule({
      imports: [SpecialtyAddComponent],
      providers: [{provide: SpecialtyService, useValue: specService}],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialtyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('form is invalid when empty', () => expect(component.form.invalid).toBe(true));

  it('form is valid with correct name', () => {
    component.nameCtrl.setValue('Radiology');
    expect(component.form.valid).toBe(true);
  });

  describe('onSubmit', () => {
    beforeEach(() => component.nameCtrl.setValue('Radiology'));

    it('calls addSpecialty', () => {
      specService.addSpecialty.mockReturnValue(of(MOCK));
      component.onSubmit();
      expect(specService.addSpecialty).toHaveBeenCalled();
    });

    it('emits newSpeciality and resets form on success', () => {
      specService.addSpecialty.mockReturnValue(of(MOCK));
      const emitted: Specialty[] = [];
      const sub = component.newSpeciality.subscribe(s => emitted.push(s));
      component.onSubmit();
      expect(emitted).toEqual([MOCK]);
      expect(component.form.value.name).toBeNull();
      sub.unsubscribe();
    });

    it('sets errorMessage on error', () => {
      specService.addSpecialty.mockReturnValue(throwError(() => 'Error'));
      component.onSubmit();
      expect(component.errorMessage()).toBe('Error');
    });
  });
});
