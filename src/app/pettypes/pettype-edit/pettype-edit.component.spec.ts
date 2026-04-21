import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, provideRouter, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {PetType} from '../pettype';
import {PetTypeService} from '../pettype.service';
import {PettypeEditComponent} from './pettype-edit.component';

const MOCK: PetType = {id: 1, name: 'Dog'};

describe('PettypeEditComponent', () => {
  let fixture: ComponentFixture<PettypeEditComponent>;
  let component: PettypeEditComponent;
  let petTypeService: { getPetTypeById: ReturnType<typeof vi.fn>; updatePetType: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    petTypeService = {
      getPetTypeById: vi.fn().mockReturnValue(of(MOCK)),
      updatePetType: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PettypeEditComponent],
      providers: [
        {provide: PetTypeService, useValue: petTypeService},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: '1'}}}},
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PettypeEditComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('loads pet type and patches form on init', () => {
    expect(component.pettype()).toEqual(MOCK);
    expect(component.form.value.name).toBe('Dog');
  });

  describe('onSubmit', () => {
    it('calls updatePetType', () => {
      petTypeService.updatePetType.mockReturnValue(of(MOCK));
      component.onSubmit();
      expect(petTypeService.updatePetType).toHaveBeenCalledWith('1', MOCK);
    });

    it('navigates to /pettypes on success', () => {
      petTypeService.updatePetType.mockReturnValue(of(MOCK));
      const spy = vi.spyOn(router, 'navigate');
      component.onSubmit();
      expect(spy).toHaveBeenCalledWith(['/pettypes']);
    });

    it('sets errorMessage on error', () => {
      petTypeService.updatePetType.mockReturnValue(throwError(() => 'Error'));
      component.onSubmit();
      expect(component.errorMessage()).toBe('Error');
    });
  });

  it('onBack() navigates to /pettypes', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.onBack();
    expect(spy).toHaveBeenCalledWith(['/pettypes']);
  });
});
