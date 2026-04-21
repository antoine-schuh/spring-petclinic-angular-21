import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Owner} from '../owner';
import {OwnerService} from '../owner.service';
import {OwnerAddComponent} from './owner-add.component';

describe('OwnerAddComponent', () => {
  let fixture: ComponentFixture<OwnerAddComponent>;
  let component: OwnerAddComponent;
  let ownerService: { addOwner: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    ownerService = {addOwner: vi.fn()};

    await TestBed.configureTestingModule({
      imports: [OwnerAddComponent],
      providers: [
        {provide: OwnerService, useValue: ownerService},
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerAddComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form', () => {
    it('is invalid when empty', () => {
      expect(component.form.invalid).toBe(true);
    });

    it('is valid when all fields are correctly filled', () => {
      fillForm();
      expect(component.form.valid).toBe(true);
    });

    it('rejects non-letter firstName', () => {
      component.firstNameCtrl.setValue('John1');
      expect(component.firstNameCtrl.invalid).toBe(true);
    });

    it('rejects firstName longer than 30 chars', () => {
      component.firstNameCtrl.setValue('A'.repeat(31));
      expect(component.firstNameCtrl.invalid).toBe(true);
    });

    it('rejects non-digit telephone', () => {
      component.telephoneCtrl.setValue('abc');
      expect(component.telephoneCtrl.invalid).toBe(true);
    });

    it('rejects telephone longer than 20 digits', () => {
      component.telephoneCtrl.setValue('1'.repeat(21));
      expect(component.telephoneCtrl.invalid).toBe(true);
    });

    it('rejects address longer than 255 chars', () => {
      component.addressCtrl.setValue('A'.repeat(256));
      expect(component.addressCtrl.invalid).toBe(true);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => fillForm());

    it('calls addOwner with form data', () => {
      ownerService.addOwner.mockReturnValue(of({} as Owner));
      component.onSubmit();
      expect(ownerService.addOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'Springfield',
          telephone: '1234567890',
        })
      );
    });

    it('navigates to /owners on success', () => {
      ownerService.addOwner.mockReturnValue(of({} as Owner));
      const spy = vi.spyOn(router, 'navigate');
      component.onSubmit();
      expect(spy).toHaveBeenCalledWith(['/owners']);
    });

    it('sets errorMessage on error', () => {
      ownerService.addOwner.mockReturnValue(throwError(() => 'Server error'));
      component.onSubmit();
      expect(component.errorMessage()).toBe('Server error');
    });
  });

  it('navigates to /owners when gotoOwnersList is called', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.gotoOwnersList();
    expect(spy).toHaveBeenCalledWith(['/owners']);
  });

  it('submit button is disabled when form is invalid', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);
  });

  it('submit button is enabled when form is valid', () => {
    fillForm();
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(false);
  });

  function fillForm() {
    component.firstNameCtrl.setValue('John');
    component.lastNameCtrl.setValue('Doe');
    component.addressCtrl.setValue('123 Main St');
    component.cityCtrl.setValue('Springfield');
    component.telephoneCtrl.setValue('1234567890');
  }
});
