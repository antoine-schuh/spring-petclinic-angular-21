import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, provideRouter, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Owner} from '../../owners/owner';
import {OwnerService} from '../../owners/owner.service';
import {Pet} from '../../pets/pet';
import {PetService} from '../../pets/pet.service';
import {PetType} from '../../pettypes/pettype';
import {VisitService} from '../visit.service';
import {VisitAddComponent} from './visit-add.component';

const MOCK_PET_TYPE: PetType = {id: 1, name: 'Dog'};
const MOCK_OWNER: Owner = {
  id: 10,
  firstName: 'Alice',
  lastName: 'Smith',
  address: '1 Main',
  city: 'Springfield',
  telephone: '555-1234',
  pets: []
};
const MOCK_PET: Pet = {
  id: 5,
  ownerId: 10,
  name: 'Rex',
  birthDate: '2020-01-01',
  type: MOCK_PET_TYPE,
  owner: MOCK_OWNER,
  visits: []
};

describe('VisitAddComponent', () => {
  let fixture: ComponentFixture<VisitAddComponent>;
  let component: VisitAddComponent;
  let visitService: { addVisit: ReturnType<typeof vi.fn> };
  let petService: { getPetById: ReturnType<typeof vi.fn> };
  let ownerService: { getOwnerById: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    visitService = {addVisit: vi.fn()};
    petService = {getPetById: vi.fn().mockReturnValue(of(MOCK_PET))};
    ownerService = {getOwnerById: vi.fn().mockReturnValue(of(MOCK_OWNER))};

    await TestBed.configureTestingModule({
      imports: [VisitAddComponent],
      providers: [
        {provide: VisitService, useValue: visitService},
        {provide: PetService, useValue: petService},
        {provide: OwnerService, useValue: ownerService},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: '5'}}}},
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VisitAddComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('loads pet and owner on init', () => {
    expect(component.currentPet()).toEqual(MOCK_PET);
    expect(component.currentOwner()).toEqual(MOCK_OWNER);
    expect(component.currentPetType()).toEqual(MOCK_PET_TYPE);
  });

  it('sets errorMessage when pet load fails', async () => {
    petService.getPetById.mockReturnValue(throwError(() => 'Load error'));

    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [VisitAddComponent],
      providers: [
        {provide: VisitService, useValue: visitService},
        {provide: PetService, useValue: petService},
        {provide: OwnerService, useValue: ownerService},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: '5'}}}},
        provideRouter([]),
      ],
    }).compileComponents();

    const f = TestBed.createComponent(VisitAddComponent);
    f.detectChanges();
    expect(f.componentInstance.errorMessage()).toBe('Load error');
  });

  it('form is invalid when empty', () => expect(component.form.invalid).toBe(true));

  describe('onSubmit', () => {
    beforeEach(() => {
      component.dateCtrl.setValue(new Date('2024-05-01'));
      component.descriptionCtrl.setValue('Annual checkup');
    });

    it('calls addVisit on submit', () => {
      visitService.addVisit.mockReturnValue(of({}));
      component.onSubmit();
      expect(visitService.addVisit).toHaveBeenCalled();
    });

    it('navigates to owner detail on success', () => {
      visitService.addVisit.mockReturnValue(of({}));
      const spy = vi.spyOn(router, 'navigate');
      component.onSubmit();
      expect(spy).toHaveBeenCalledWith(['/owners', MOCK_OWNER.id]);
    });

    it('sets errorMessage on submit error', () => {
      visitService.addVisit.mockReturnValue(throwError(() => 'Submit error'));
      component.onSubmit();
      expect(component.errorMessage()).toBe('Submit error');
    });
  });

  it('gotoOwnerDetail() navigates to owner page', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.gotoOwnerDetail();
    expect(spy).toHaveBeenCalledWith(['/owners', MOCK_OWNER.id]);
  });
});
