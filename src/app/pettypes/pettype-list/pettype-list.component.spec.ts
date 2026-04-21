import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {PetType} from '../pettype';
import {PetTypeService} from '../pettype.service';
import {PettypeListComponent} from './pettype-list.component';

const MOCK: PetType[] = [{id: 1, name: 'Dog'}, {id: 2, name: 'Cat'}];

describe('PettypeListComponent', () => {
  let fixture: ComponentFixture<PettypeListComponent>;
  let component: PettypeListComponent;
  let petTypeService: { getPetTypes: ReturnType<typeof vi.fn>; deletePetType: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    petTypeService = {
      getPetTypes: vi.fn().mockReturnValue(of(MOCK)),
      deletePetType: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PettypeListComponent],
      providers: [
        {provide: PetTypeService, useValue: petTypeService},
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PettypeListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('loads pet types on init', () => {
    expect(component.pettypes()).toEqual(MOCK);
    expect(component.isPetTypesDataReceived()).toBe(true);
  });

  it('deletePettype() removes pet type from list', () => {
    petTypeService.deletePetType.mockReturnValue(of(200));
    component.deletePettype(MOCK[0]);
    expect(component.pettypes()).toEqual([MOCK[1]]);
  });

  it('deletePettype() sets errorMessage on error', () => {
    petTypeService.deletePetType.mockReturnValue(throwError(() => 'Error'));
    component.deletePettype(MOCK[0]);
    expect(component.errorMessage()).toBe('Error');
  });

  it('onNewPettype() appends pet type', () => {
    const newType: PetType = {id: 3, name: 'Bird'};
    component.onNewPettype(newType);
    expect(component.pettypes()).toContain(newType);
  });

  it('showAddPettypeComponent() toggles isInsert', () => {
    component.showAddPettypeComponent();
    expect(component.isInsert()).toBe(true);
  });

  it('showEditPettypeComponent() navigates to edit', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.showEditPettypeComponent(MOCK[0]);
    expect(spy).toHaveBeenCalledWith(['/pettypes', '1', 'edit']);
  });

  it('gotoHome() navigates to /welcome', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.gotoHome();
    expect(spy).toHaveBeenCalledWith(['/welcome']);
  });
});
