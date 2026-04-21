import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpErrorHandler} from '../error.service';
import {Owner} from '../owners/owner';
import {Pet} from './pet';
import {PetService} from './pet.service';

const BASE = 'http://localhost:9966/petclinic/api/';
const OWNER: Owner = {
  id: 2,
  firstName: 'Jane',
  lastName: 'Doe',
  address: '1 St',
  city: 'City',
  telephone: '0000',
  pets: []
};
const MOCK: Pet = {
  id: 1,
  name: 'Buddy',
  birthDate: '2020-01-01',
  type: {id: 1, name: 'dog'},
  ownerId: 2,
  owner: OWNER,
  visits: []
};

describe('PetService', () => {
  let service: PetService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), HttpErrorHandler],
    });
    service = TestBed.inject(PetService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => expect(service).toBeTruthy());

  it('getPets() GETs base pets URL', () => {
    service.getPets().subscribe(r => expect(r).toEqual([MOCK]));
    http.expectOne(`${BASE}pets`).flush([MOCK]);
  });

  it('getPetById() GETs correct URL', () => {
    service.getPetById(1).subscribe(r => expect(r).toEqual(MOCK));
    http.expectOne(`${BASE}pets/1`).flush(MOCK);
  });

  it('addPet() POSTs to owners/:id/pets URL', () => {
    service.addPet(MOCK).subscribe();
    const req = http.expectOne(`${BASE}owners/2/pets`);
    expect(req.request.method).toBe('POST');
    req.flush(MOCK);
  });

  it('updatePet() PUTs to correct URL', () => {
    service.updatePet('1', MOCK).subscribe();
    const req = http.expectOne(`${BASE}pets/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(MOCK);
  });

  it('deletePet() DELETEs correct URL', () => {
    service.deletePet('1').subscribe();
    const req = http.expectOne(`${BASE}pets/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(1);
  });
});
