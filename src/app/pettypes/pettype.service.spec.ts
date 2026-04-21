import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpErrorHandler} from '../error.service';
import {PetType} from './pettype';
import {PetTypeService} from './pettype.service';

const BASE = 'http://localhost:9966/petclinic/api/pettypes';
const MOCK: PetType = {id: 1, name: 'Dog'};

describe('PetTypeService', () => {
  let service: PetTypeService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), HttpErrorHandler],
    });
    service = TestBed.inject(PetTypeService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => expect(service).toBeTruthy());

  it('getPetTypes() GETs base URL', () => {
    service.getPetTypes().subscribe(r => expect(r).toEqual([MOCK]));
    http.expectOne(BASE).flush([MOCK]);
  });

  it('getPetTypeById() GETs correct URL', () => {
    service.getPetTypeById('1').subscribe(r => expect(r).toEqual(MOCK));
    http.expectOne(`${BASE}/1`).flush(MOCK);
  });

  it('addPetType() POSTs to base URL', () => {
    service.addPetType(MOCK).subscribe();
    const req = http.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    req.flush(MOCK);
  });

  it('updatePetType() PUTs to correct URL', () => {
    service.updatePetType('1', MOCK).subscribe();
    const req = http.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(MOCK);
  });

  it('deletePetType() DELETEs correct URL', () => {
    service.deletePetType('1').subscribe();
    const req = http.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(1);
  });
});
