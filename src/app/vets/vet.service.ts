import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {HandleError, HttpErrorHandler} from '../error.service';
import {Vet} from './vet';

@Injectable({ providedIn: 'root' })
export class VetService {
  private http = inject(HttpClient);
  private httpErrorHandler = inject(HttpErrorHandler);

  entityUrl = environment.REST_API_URL + 'vets';

  private readonly handlerError: HandleError;

  constructor() {
    const httpErrorHandler = this.httpErrorHandler;

    this.handlerError = httpErrorHandler.createHandleError('OwnerService');
  }

  getVets(): Observable<Vet[]> {
    return this.http
      .get<Vet[]>(this.entityUrl)
      .pipe(catchError(this.handlerError('getVets', [])));
  }

  getVetById(vetId: string): Observable<Vet> {
    return this.http
      .get<Vet>(this.entityUrl + '/' + vetId)
      .pipe(catchError(this.handlerError('getVetById', {} as Vet)));
  }

  updateVet(vetId: string, vet: Vet): Observable<Vet> {
    return this.http
      .put<Vet>(this.entityUrl + '/' + vetId, vet)
      .pipe(catchError(this.handlerError('updateVet', vet)));
  }

  addVet(vet: Vet): Observable<Vet> {
    return this.http
      .post<Vet>(this.entityUrl, vet)
      .pipe(catchError(this.handlerError('addVet', vet)));
  }

  deleteVet(vetId: string): Observable<number> {
    return this.http
      .delete<number>(this.entityUrl + '/' + vetId)
      .pipe(catchError(this.handlerError('deleteVet', 0)));
  }
}
