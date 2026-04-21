import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpErrorHandler} from '../error.service';
import {Vet} from './vet';
import {VetService} from './vet.service';

const BASE = 'http://localhost:9966/petclinic/api/vets';
const MOCK: Vet = {id: 1, firstName: 'Alice', lastName: 'Smith', specialties: []};

describe('VetService', () => {
  let service: VetService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), HttpErrorHandler],
    });
    service = TestBed.inject(VetService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => expect(service).toBeTruthy());

  it('getVets() GETs base URL', () => {
    service.getVets().subscribe(r => expect(r).toEqual([MOCK]));
    http.expectOne(BASE).flush([MOCK]);
  });

  it('getVetById() GETs correct URL', () => {
    service.getVetById('1').subscribe(r => expect(r).toEqual(MOCK));
    http.expectOne(`${BASE}/1`).flush(MOCK);
  });

  it('addVet() POSTs to base URL', () => {
    service.addVet(MOCK).subscribe();
    const req = http.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    req.flush(MOCK);
  });

  it('updateVet() PUTs to correct URL', () => {
    service.updateVet('1', MOCK).subscribe();
    const req = http.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(MOCK);
  });

  it('deleteVet() DELETEs correct URL', () => {
    service.deleteVet('1').subscribe();
    const req = http.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(1);
  });
});
