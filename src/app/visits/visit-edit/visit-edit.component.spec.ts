import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, provideRouter, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Owner} from '../../owners/owner';
import {OwnerService} from '../../owners/owner.service';
import {Pet} from '../../pets/pet';
import {PetService} from '../../pets/pet.service';
import {PetType} from '../../pettypes/pettype';
import {Visit} from '../visit';
import {VisitService} from '../visit.service';
import {VisitEditComponent} from './visit-edit.component';

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
const MOCK_VISIT: Visit = {id: 42, date: '2024-05-01', description: 'Annual checkup', pet: MOCK_PET, petId: 5};

describe('VisitEditComponent', () => {
  let fixture: ComponentFixture<VisitEditComponent>;
  let component: VisitEditComponent;
  let visitService: { getVisitById: ReturnType<typeof vi.fn>; updateVisit: ReturnType<typeof vi.fn> };
  let petService: { getPetById: ReturnType<typeof vi.fn> };
  let ownerService: { getOwnerById: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    visitService = {
      getVisitById: vi.fn().mockReturnValue(of(MOCK_VISIT)),
      updateVisit: vi.fn(),
    };
    petService = {getPetById: vi.fn().mockReturnValue(of(MOCK_PET))};
    ownerService = {getOwnerById: vi.fn().mockReturnValue(of(MOCK_OWNER))};

    await TestBed.configureTestingModule({
      imports: [VisitEditComponent],
      providers: [
        {provide: VisitService, useValue: visitService},
        {provide: PetService, useValue: petService},
        {provide: OwnerService, useValue: ownerService},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: '42'}}}},
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VisitEditComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('loads visit, pet, and owner on init', () => {
    expect(component.visit()).toEqual(MOCK_VISIT);
    expect(component.currentPet()).toEqual(MOCK_PET);
    expect(component.currentOwner()).toEqual(MOCK_OWNER);
    expect(component.currentPetType()).toEqual(MOCK_PET_TYPE);
  });

  it('patches form with visit values on load', () => {
    expect(component.descriptionCtrl.value).toBe('Annual checkup');
    expect(component.dateCtrl.value).toEqual(new Date('2024-05-01'));
  });

  it('sets errorMessage when chain fails', async () => {
    visitService.getVisitById.mockReturnValue(throwError(() => 'Chain error'));

    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [VisitEditComponent],
      providers: [
        {provide: VisitService, useValue: visitService},
        {provide: PetService, useValue: petService},
        {provide: OwnerService, useValue: ownerService},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: '42'}}}},
        provideRouter([]),
      ],
    }).compileComponents();

    const f = TestBed.createComponent(VisitEditComponent);
    f.detectChanges();
    expect(f.componentInstance.errorMessage()).toBe('Chain error');
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.dateCtrl.setValue(new Date('2024-06-01'));
      component.descriptionCtrl.setValue('Follow-up');
    });

    it('calls updateVisit on submit', () => {
      visitService.updateVisit.mockReturnValue(of(MOCK_VISIT));
      component.onSubmit();
      expect(visitService.updateVisit).toHaveBeenCalledWith('42', expect.objectContaining({description: 'Follow-up'}));
    });

    it('navigates to owner detail on success', () => {
      visitService.updateVisit.mockReturnValue(of(MOCK_VISIT));
      const spy = vi.spyOn(router, 'navigate');
      component.onSubmit();
      expect(spy).toHaveBeenCalledWith(['/owners', MOCK_OWNER.id]);
    });

    it('sets errorMessage on submit error', () => {
      visitService.updateVisit.mockReturnValue(throwError(() => 'Submit error'));
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
