import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of, throwError} from 'rxjs';
import {PetType} from '../pettype';
import {PetTypeService} from '../pettype.service';
import {PettypeAddComponent} from './pettype-add.component';

const MOCK: PetType = {id: 1, name: 'Dog'};

describe('PettypeAddComponent', () => {
  let fixture: ComponentFixture<PettypeAddComponent>;
  let component: PettypeAddComponent;
  let petTypeService: { addPetType: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    petTypeService = {addPetType: vi.fn()};

    await TestBed.configureTestingModule({
      imports: [PettypeAddComponent],
      providers: [{provide: PetTypeService, useValue: petTypeService}],
    }).compileComponents();

    fixture = TestBed.createComponent(PettypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('form is invalid when empty', () => expect(component.form.invalid).toBe(true));

  it('form is valid with correct name', () => {
    component.nameCtrl.setValue('Dog');
    expect(component.form.valid).toBe(true);
  });

  describe('onSubmit', () => {
    beforeEach(() => component.nameCtrl.setValue('Dog'));

    it('calls addPetType', () => {
      petTypeService.addPetType.mockReturnValue(of(MOCK));
      component.onSubmit();
      expect(petTypeService.addPetType).toHaveBeenCalled();
    });

    it('emits newPetType and resets form on success', () => {
      petTypeService.addPetType.mockReturnValue(of(MOCK));
      const emitted: PetType[] = [];
      const sub = component.newPetType.subscribe(p => emitted.push(p));
      component.onSubmit();
      expect(emitted).toEqual([MOCK]);
      expect(component.form.value.name).toBeNull();
      sub.unsubscribe();
    });

    it('sets errorMessage on error', () => {
      petTypeService.addPetType.mockReturnValue(throwError(() => 'Error'));
      component.onSubmit();
      expect(component.errorMessage()).toBe('Error');
    });
  });
});
