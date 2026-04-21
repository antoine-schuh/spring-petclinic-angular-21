import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, provideRouter, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Owner} from '../owner';
import {OwnerService} from '../owner.service';
import {OwnerEditComponent} from './owner-edit.component';

const MOCK: Owner = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Main',
  city: 'Springfield',
  telephone: '1234567890',
  pets: []
};

describe('OwnerEditComponent', () => {
  let fixture: ComponentFixture<OwnerEditComponent>;
  let component: OwnerEditComponent;
  let ownerService: { getOwnerById: ReturnType<typeof vi.fn>; updateOwner: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    ownerService = {
      getOwnerById: vi.fn().mockReturnValue(of(MOCK)),
      updateOwner: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [OwnerEditComponent],
      providers: [
        {provide: OwnerService, useValue: ownerService},
        provideRouter([]),
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: '1'}}}},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerEditComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('loads owner and patches form on init', () => {
    expect(component.owner()).toEqual(MOCK);
    expect(component.form.value.firstName).toBe('John');
    expect(component.form.value.lastName).toBe('Doe');
  });

  it('form is valid when loaded with correct data', () => {
    expect(component.form.valid).toBe(true);
  });

  describe('onSubmit', () => {
    it('calls updateOwner with correct data', () => {
      ownerService.updateOwner.mockReturnValue(of(MOCK));
      component.onSubmit();
      expect(ownerService.updateOwner).toHaveBeenCalledWith('1', expect.objectContaining({id: 1}));
    });

    it('navigates to owner detail on success', () => {
      ownerService.updateOwner.mockReturnValue(of(MOCK));
      const spy = vi.spyOn(router, 'navigate');
      component.onSubmit();
      expect(spy).toHaveBeenCalledWith(['/owners', 1]);
    });

    it('sets errorMessage on error', () => {
      ownerService.updateOwner.mockReturnValue(throwError(() => 'Error'));
      component.onSubmit();
      expect(component.errorMessage()).toBe('Error');
    });
  });

  it('gotoOwnerDetail() clears errorMessage and navigates', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.gotoOwnerDetail(MOCK);
    expect(component.errorMessage()).toBe('');
    expect(spy).toHaveBeenCalledWith(['/owners', 1]);
  });
});
