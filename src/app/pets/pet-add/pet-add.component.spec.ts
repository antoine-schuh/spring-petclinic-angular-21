import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, provideRouter, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Owner} from '../../owners/owner';
import {OwnerService} from '../../owners/owner.service';
import {PetType} from '../../pettypes/pettype';
import {PetTypeService} from '../../pettypes/pettype.service';
import {Pet} from '../pet';
import {PetService} from '../pet.service';
import {PetAddComponent} from './pet-add.component';

const MOCK_OWNER: Owner = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Main',
  city: 'Springfield',
  telephone: '1234567890',
  pets: []
};
const MOCK_TYPES: PetType[] = [{id: 1, name: 'Dog'}, {id: 2, name: 'Cat'}];
const MOCK_PET: Pet = {
  id: 1,
  name: 'Buddy',
  birthDate: '2020-01-01',
  type: MOCK_TYPES[0],
  ownerId: 1,
  owner: MOCK_OWNER,
  visits: []
};

describe('PetAddComponent', () => {
  let fixture: ComponentFixture<PetAddComponent>;
  let component: PetAddComponent;
  let petService: { addPet: ReturnType<typeof vi.fn> };
  let petTypeService: { getPetTypes: ReturnType<typeof vi.fn> };
  let ownerService: { getOwnerById: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    petService = {addPet: vi.fn()};
    petTypeService = {getPetTypes: vi.fn().mockReturnValue(of(MOCK_TYPES))};
    ownerService = {getOwnerById: vi.fn().mockReturnValue(of(MOCK_OWNER))};

    await TestBed.configureTestingModule({
      imports: [PetAddComponent],
      providers: [
        {provide: PetService, useValue: petService},
        {provide: PetTypeService, useValue: petTypeService},
        {provide: OwnerService, useValue: ownerService},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: '1'}}}},
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetAddComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('loads pet types and owner on init', () => {
    expect(component.petTypes()).toEqual(MOCK_TYPES);
    expect(component.currentOwner()).toEqual(MOCK_OWNER);
  });

  it('form is invalid when empty', () => expect(component.form.invalid).toBe(true));

  describe('onSubmit', () => {
    beforeEach(() => {
      component.nameCtrl.setValue('Buddy');
      component.birthDateCtrl.setValue(new Date('2020-01-01'));
      component.typeCtrl.setValue(1);
    });

    it('calls addPet on valid form', () => {
      petService.addPet.mockReturnValue(of(MOCK_PET));
      component.onSubmit();
      expect(petService.addPet).toHaveBeenCalled();
    });

    it('navigates to owner detail on success', () => {
      petService.addPet.mockReturnValue(of(MOCK_PET));
      const spy = vi.spyOn(router, 'navigate');
      component.onSubmit();
      expect(spy).toHaveBeenCalledWith(['/owners', 1]);
    });

    it('sets errorMessage on error', () => {
      petService.addPet.mockReturnValue(throwError(() => 'Error'));
      component.onSubmit();
      expect(component.errorMessage()).toBe('Error');
    });
  });
});
