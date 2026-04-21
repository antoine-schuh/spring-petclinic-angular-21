import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Vet} from '../vet';
import {VetService} from '../vet.service';
import {VetListComponent} from './vet-list.component';

const MOCK: Vet[] = [
  {id: 1, firstName: 'Alice', lastName: 'Smith', specialties: []},
  {id: 2, firstName: 'Bob', lastName: 'Jones', specialties: []},
];

describe('VetListComponent', () => {
  let fixture: ComponentFixture<VetListComponent>;
  let component: VetListComponent;
  let vetService: { getVets: ReturnType<typeof vi.fn>; deleteVet: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    vetService = {
      getVets: vi.fn().mockReturnValue(of(MOCK)),
      deleteVet: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [VetListComponent],
      providers: [
        {provide: VetService, useValue: vetService},
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VetListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('loads vets on init', () => {
    expect(component.vets()).toEqual(MOCK);
    expect(component.isVetDataReceived()).toBe(true);
  });

  it('deleteVet() removes vet from list', () => {
    vetService.deleteVet.mockReturnValue(of(200));
    component.deleteVet(MOCK[0]);
    expect(component.vets()).toEqual([MOCK[1]]);
  });

  it('deleteVet() sets errorMessage on error', () => {
    vetService.deleteVet.mockReturnValue(throwError(() => 'Error'));
    component.deleteVet(MOCK[0]);
    expect(component.errorMessage()).toBe('Error');
  });

  it('addVet() navigates to /vets/add', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.addVet();
    expect(spy).toHaveBeenCalledWith(['/vets/add']);
  });

  it('editVet() navigates to edit page', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.editVet(MOCK[0]);
    expect(spy).toHaveBeenCalledWith(['/vets', 1, 'edit']);
  });

  it('gotoHome() navigates to /welcome', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.gotoHome();
    expect(spy).toHaveBeenCalledWith(['/welcome']);
  });
});
