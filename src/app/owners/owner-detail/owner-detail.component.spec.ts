import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, provideRouter, Router} from '@angular/router';
import {of} from 'rxjs';
import {Owner} from '../owner';
import {OwnerService} from '../owner.service';
import {OwnerDetailComponent} from './owner-detail.component';

const MOCK: Owner = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Main',
  city: 'Springfield',
  telephone: '1234567890',
  pets: []
};

describe('OwnerDetailComponent', () => {
  let fixture: ComponentFixture<OwnerDetailComponent>;
  let component: OwnerDetailComponent;
  let ownerService: { getOwnerById: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    ownerService = {getOwnerById: vi.fn().mockReturnValue(of(MOCK))};

    await TestBed.configureTestingModule({
      imports: [OwnerDetailComponent],
      providers: [
        { provide: OwnerService, useValue: ownerService },
        provideRouter([]),
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: 1}}}},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('loads owner on init', () => {
    expect(ownerService.getOwnerById).toHaveBeenCalledWith(1);
    expect(component.owner()).toEqual(MOCK);
  });

  it('gotoOwnersList() navigates to /owners', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.gotoOwnersList();
    expect(spy).toHaveBeenCalledWith(['/owners']);
  });

  it('editOwner() navigates to edit page', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.editOwner();
    expect(spy).toHaveBeenCalledWith(['/owners', 1, 'edit']);
  });

  it('addPet() navigates to add pet page', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.addPet(MOCK);
    expect(spy).toHaveBeenCalledWith(['/owners', 1, 'pets', 'add']);
  });
});
