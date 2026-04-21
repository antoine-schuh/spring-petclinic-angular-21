import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Pet} from '../pet';
import {PetService} from '../pet.service';
import {PetListComponent} from './pet-list.component';

const MOCK_PET: Pet = {
  id: 1,
  name: 'Buddy',
  birthDate: '2020-01-01',
  type: {id: 1, name: 'dog'},
  ownerId: 1,
  owner: null,
  visits: []
};

describe('PetListComponent', () => {
  let fixture: ComponentFixture<PetListComponent>;
  let component: PetListComponent;
  let petService: { deletePet: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    petService = {deletePet: vi.fn()};

    await TestBed.configureTestingModule({
      imports: [PetListComponent],
      providers: [
        {provide: PetService, useValue: petService},
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('pet', MOCK_PET);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('editPet() navigates to edit page', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.editPet(MOCK_PET);
    expect(spy).toHaveBeenCalledWith(['/pets', 1, 'edit']);
  });

  it('addVisit() navigates to add visit page', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.addVisit(MOCK_PET);
    expect(spy).toHaveBeenCalledWith(['/pets', 1, 'visits', 'add']);
  });

  it('deletePet() sets deleteSuccess on success', () => {
    petService.deletePet.mockReturnValue(of(null));
    component.deletePet(MOCK_PET);
    expect(component.deleteSuccess()).toBe(true);
  });

  it('deletePet() sets errorMessage on error', () => {
    petService.deletePet.mockReturnValue(throwError(() => 'Error'));
    component.deletePet(MOCK_PET);
    expect(component.errorMessage).toBe('Error');
  });
});
