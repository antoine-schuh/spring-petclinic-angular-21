import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {firstValueFrom} from 'rxjs';
import {HttpErrorHandler} from './error.service';

describe('HttpErrorHandler', () => {
  let service: HttpErrorHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [HttpErrorHandler]});
    service = TestBed.inject(HttpErrorHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('createHandleError returns a function', () => {
    expect(typeof service.createHandleError('TestService')).toBe('function');
  });

  it('handleError emits error message from ErrorEvent', async () => {
    const event = new ErrorEvent('network', {message: 'Network failure'});
    const httpError = new HttpErrorResponse({error: event, status: 0});
    await expect(firstValueFrom(service.handleError('Svc', 'op', [])(httpError))).rejects.toBe('Network failure');
  });

  it('handleError emits server status message when not ErrorEvent', async () => {
    const httpError = new HttpErrorResponse({error: 'Bad request', status: 400});
    await expect(firstValueFrom(service.handleError('Svc', 'op', [])(httpError))).rejects.toContain('400');
  });

  it('handleError uses Spring MVC errors header when present', async () => {
    const errors = [{errorMessage: 'Field error'}];
    const headers = new HttpHeaders({errors: JSON.stringify(errors)});
    const httpError = new HttpErrorResponse({error: 'Bad', status: 400, headers});
    await expect(firstValueFrom(service.handleError('Svc', 'op', [])(httpError))).rejects.toBe('Field error');
  });
});
