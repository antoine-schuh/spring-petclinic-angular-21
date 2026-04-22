import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {HandleError, HttpErrorHandler} from '../error.service';
import {Vet} from './vet';
import {VetTop} from './vet-top';

@Injectable({ providedIn: 'root' })
export class VetService {
  private http = inject(HttpClient);
  private httpErrorHandler = inject(HttpErrorHandler);

  private readonly entityUrl = environment.REST_API_URL + 'vets';

  private readonly handlerError: HandleError;

  constructor() {
    const httpErrorHandler = this.httpErrorHandler;

    this.handlerError = httpErrorHandler.createHandleError('VetService');
  }

  getTopVets(): Observable<VetTop[]> {
    // TODO: replace with real API call when endpoint is available
    // return this.http
    //   .get<VetTop[]>(this.entityUrl + '/top')
    //   .pipe(catchError(this.handlerError('getTopVets', [])));
    return of([
      {id: 1, firstName: 'James', lastName: 'Carter', visitCount: 42, distinctPetCount: 31},
      {id: 2, firstName: 'Helen', lastName: 'Leary', visitCount: 37, distinctPetCount: 28},
      {id: 3, firstName: 'Linda', lastName: 'Douglas', visitCount: 29, distinctPetCount: 22},
    ]);
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
