import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpErrorHandler} from '../error.service';
import {Owner} from '../owners/owner';
import {Pet} from '../pets/pet';
import {Visit} from './visit';
import {VisitService} from './visit.service';

const BASE = 'http://localhost:9966/petclinic/api/';
const OWNER: Owner = {id: 3, firstName: 'A', lastName: 'B', address: '', city: '', telephone: '', pets: []};
const PET: Pet = {
  id: 2,
  name: 'Rex',
  birthDate: '2021-01-01',
  type: {id: 1, name: 'dog'},
  ownerId: 3,
  owner: OWNER,
  visits: []
};
const MOCK: Visit = {id: 1, date: '2024-01-01', description: 'Check-up', petId: 2, pet: PET};

describe('VisitService', () => {
  let service: VisitService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), HttpErrorHandler],
    });
    service = TestBed.inject(VisitService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => expect(service).toBeTruthy());

  it('getVisits() GETs base URL', () => {
    service.getVisits().subscribe(r => expect(r).toEqual([MOCK]));
    http.expectOne(`${BASE}visits`).flush([MOCK]);
  });

  it('getVisitById() GETs correct URL', () => {
    service.getVisitById('1').subscribe(r => expect(r).toEqual(MOCK));
    http.expectOne(`${BASE}visits/1`).flush(MOCK);
  });

  it('addVisit() POSTs to owners/:ownerId/pets/:petId/visits URL', () => {
    service.addVisit(MOCK).subscribe();
    const req = http.expectOne(`${BASE}owners/3/pets/2/visits`);
    expect(req.request.method).toBe('POST');
    req.flush(MOCK);
  });

  it('updateVisit() PUTs to correct URL', () => {
    service.updateVisit('1', MOCK).subscribe();
    const req = http.expectOne(`${BASE}visits/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(MOCK);
  });

  it('deleteVisit() DELETEs correct URL', () => {
    service.deleteVisit('1').subscribe();
    const req = http.expectOne(`${BASE}visits/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(1);
  });
});
