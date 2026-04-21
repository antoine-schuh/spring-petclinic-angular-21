import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpErrorHandler} from '../error.service';
import {Specialty} from './specialty';
import {SpecialtyService} from './specialty.service';

const BASE = 'http://localhost:9966/petclinic/api/specialties';
const MOCK: Specialty = {id: 1, name: 'Radiology'};

describe('SpecialtyService', () => {
  let service: SpecialtyService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), HttpErrorHandler],
    });
    service = TestBed.inject(SpecialtyService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => expect(service).toBeTruthy());

  it('getSpecialties() GETs base URL', () => {
    service.getSpecialties().subscribe(r => expect(r).toEqual([MOCK]));
    http.expectOne(BASE).flush([MOCK]);
  });

  it('getSpecialtyById() GETs correct URL', () => {
    service.getSpecialtyById('1').subscribe(r => expect(r).toEqual(MOCK));
    http.expectOne(`${BASE}/1`).flush(MOCK);
  });

  it('addSpecialty() POSTs to base URL', () => {
    service.addSpecialty(MOCK).subscribe();
    const req = http.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(MOCK);
    req.flush(MOCK);
  });

  it('updateSpecialty() PUTs to correct URL', () => {
    service.updateSpecialty('1', MOCK).subscribe();
    const req = http.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(MOCK);
  });

  it('deleteSpecialty() DELETEs correct URL', () => {
    service.deleteSpecialty('1').subscribe();
    const req = http.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(1);
  });
});
