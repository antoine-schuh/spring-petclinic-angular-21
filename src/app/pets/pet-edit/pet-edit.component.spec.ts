import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, provideRouter, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Owner} from '../../owners/owner';
import {OwnerService} from '../../owners/owner.service';
import {PetType} from '../../pettypes/pettype';
import {PetTypeService} from '../../pettypes/pettype.service';
import {Pet} from '../pet';
import {PetService} from '../pet.service';
import {PetEditComponent} from './pet-edit.component';

const MOCK_OWNER: Owner = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  address: '1 Main',
  city: 'City',
  telephone: '123',
  pets: []
};
const MOCK_TYPES: PetType[] = [{id: 1, name: 'Dog'}];
const MOCK_PET: Pet = {
  id: 5,
  name: 'Buddy',
  birthDate: '2020-06-15',
  type: MOCK_TYPES[0],
  ownerId: 1,
  owner: MOCK_OWNER,
  visits: []
};

describe('PetEditComponent', () => {
  let fixture: ComponentFixture<PetEditComponent>;
  let component: PetEditComponent;
  let petService: { getPetById: ReturnType<typeof vi.fn>; updatePet: ReturnType<typeof vi.fn> };
  let petTypeService: { getPetTypes: ReturnType<typeof vi.fn> };
  let ownerService: { getOwnerById: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    petService = {getPetById: vi.fn().mockReturnValue(of(MOCK_PET)), updatePet: vi.fn()};
    petTypeService = {getPetTypes: vi.fn().mockReturnValue(of(MOCK_TYPES))};
    ownerService = {getOwnerById: vi.fn().mockReturnValue(of(MOCK_OWNER))};

    await TestBed.configureTestingModule({
      imports: [PetEditComponent],
      providers: [
        {provide: PetService, useValue: petService},
        {provide: PetTypeService, useValue: petTypeService},
        {provide: OwnerService, useValue: ownerService},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: '5'}}}},
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetEditComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('loads pet, types, and owner on init', () => {
    expect(component.pet()).toEqual(MOCK_PET);
    expect(component.petTypes()).toEqual(MOCK_TYPES);
    expect(component.currentOwner()).toEqual(MOCK_OWNER);
  });

  it('patches form with loaded pet data', () => {
    expect(component.form.value.name).toBe('Buddy');
    expect(component.form.value.type).toBe(1);
  });

  describe('onSubmit', () => {
    it('calls updatePet', () => {
      petService.updatePet.mockReturnValue(of(MOCK_PET));
      component.onSubmit();
      expect(petService.updatePet).toHaveBeenCalledWith('5', expect.objectContaining({name: 'Buddy'}));
    });

    it('navigates to owner detail on success', () => {
      petService.updatePet.mockReturnValue(of(MOCK_PET));
      const spy = vi.spyOn(router, 'navigate');
      component.onSubmit();
      expect(spy).toHaveBeenCalledWith(['/owners', 1]);
    });

    it('sets errorMessage on error', () => {
      petService.updatePet.mockReturnValue(throwError(() => 'Error'));
      component.onSubmit();
      expect(component.errorMessage()).toBe('Error');
    });
  });
});
