import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpErrorHandler} from '../error.service';
import {Owner} from './owner';
import {OwnerService} from './owner.service';

const BASE = 'http://localhost:9966/petclinic/api/owners';
const MOCK: Owner = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Main',
  city: 'Springfield',
  telephone: '1234567890',
  pets: []
};

describe('OwnerService', () => {
  let service: OwnerService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), HttpErrorHandler],
    });
    service = TestBed.inject(OwnerService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => expect(service).toBeTruthy());

  it('getOwners() GETs base URL', () => {
    service.getOwners().subscribe(r => expect(r).toEqual([MOCK]));
    http.expectOne(BASE).flush([MOCK]);
  });

  it('getOwnerById() GETs correct URL', () => {
    service.getOwnerById(1).subscribe(r => expect(r).toEqual(MOCK));
    http.expectOne(`${BASE}/1`).flush(MOCK);
  });

  it('addOwner() POSTs to base URL', () => {
    service.addOwner(MOCK).subscribe();
    const req = http.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(MOCK);
    req.flush(MOCK);
  });

  it('updateOwner() PUTs to correct URL', () => {
    service.updateOwner('1', MOCK).subscribe();
    const req = http.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(MOCK);
  });

  it('deleteOwner() DELETEs correct URL', () => {
    service.deleteOwner('1').subscribe();
    const req = http.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('searchOwners() GETs with lastName query param', () => {
    service.searchOwners('Doe').subscribe(r => expect(r).toEqual([MOCK]));
    http.expectOne(`${BASE}?lastName=Doe`).flush([MOCK]);
  });
});
