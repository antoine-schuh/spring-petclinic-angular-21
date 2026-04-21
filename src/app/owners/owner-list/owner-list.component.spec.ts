import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';
import {of} from 'rxjs';
import {Owner} from '../owner';
import {OwnerService} from '../owner.service';
import {OwnerListComponent} from './owner-list.component';

const MOCK_OWNERS: Owner[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main',
    city: 'Springfield',
    telephone: '1234567890',
    pets: []
  },
];

describe('OwnerListComponent', () => {
  let fixture: ComponentFixture<OwnerListComponent>;
  let component: OwnerListComponent;
  let ownerService: { getOwners: ReturnType<typeof vi.fn>; searchOwners: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    ownerService = {
      getOwners: vi.fn().mockReturnValue(of(MOCK_OWNERS)),
      searchOwners: vi.fn().mockReturnValue(of(MOCK_OWNERS)),
    };

    await TestBed.configureTestingModule({
      imports: [OwnerListComponent],
      providers: [
        { provide: OwnerService, useValue: ownerService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('loads owners on init via getOwners()', () => {
    expect(ownerService.getOwners).toHaveBeenCalled();
    expect(component.owners()).toEqual(MOCK_OWNERS);
    expect(component.isOwnersDataReceived()).toBe(true);
  });

  it('searchByLastName() updates searchKey and calls searchOwners()', () => {
    ownerService.searchOwners.mockReturnValue(of(MOCK_OWNERS));
    component.searchByLastName('Doe');
    fixture.detectChanges();
    expect(ownerService.searchOwners).toHaveBeenCalledWith('Doe');
  });

  it('searchByLastName with empty string calls getOwners()', () => {
    component.searchByLastName('Doe');
    component.searchByLastName('');
    fixture.detectChanges();
    expect(ownerService.getOwners).toHaveBeenCalled();
  });

  it('onSelect() navigates to owner detail', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.onSelect(MOCK_OWNERS[0]);
    expect(spy).toHaveBeenCalledWith(['/owners', 1]);
  });

  it('addOwner() navigates to add owner page', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.addOwner();
    expect(spy).toHaveBeenCalledWith(['/owners/add']);
  });
});
