import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {HandleError, HttpErrorHandler} from '../error.service';
import {Visit} from './visit';

@Injectable({ providedIn: 'root' })
export class VisitService {
  private http = inject(HttpClient);
  private httpErrorHandler = inject(HttpErrorHandler);

  private entityUrl = environment.REST_API_URL + 'visits';

  private readonly handlerError: HandleError;

  constructor() {
    const httpErrorHandler = this.httpErrorHandler;

    this.handlerError = httpErrorHandler.createHandleError('VisitService');
  }

  getVisits(): Observable<Visit[]> {
    return this.http
      .get<Visit[]>(this.entityUrl)
      .pipe(catchError(this.handlerError('getVisits', [])));
  }

  getVisitById(visitId: string): Observable<Visit> {
    return this.http
      .get<Visit>(this.entityUrl + '/' + visitId)
      .pipe(catchError(this.handlerError('getVisitById', {} as Visit)));
  }

  addVisit(visit: Visit): Observable<Visit> {
    const ownerId = visit.pet.ownerId;
    const petId = visit.pet.id;
    const visitsUrl =
      environment.REST_API_URL + `owners/${ownerId}/pets/${petId}/visits`;
    return this.http
      .post<Visit>(visitsUrl, visit)
      .pipe(catchError(this.handlerError('addVisit', visit)));
  }

  updateVisit(visitId: string, visit: Visit): Observable<Visit> {
    return this.http
      .put<Visit>(this.entityUrl + '/' + visitId, visit)
      .pipe(catchError(this.handlerError('updateVisit', visit)));
  }

  deleteVisit(visitId: string): Observable<number> {
    return this.http
      .delete<number>(this.entityUrl + '/' + visitId)
      .pipe(catchError(this.handlerError('deleteVisit', 0)));
  }
}
