import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {HandleError, HttpErrorHandler} from '../error.service';
import {PetType} from './pettype';

@Injectable({ providedIn: 'root' })
export class PetTypeService {
  private http = inject(HttpClient);
  private httpErrorHandler = inject(HttpErrorHandler);

  entityUrl = environment.REST_API_URL + 'pettypes';

  private readonly handlerError: HandleError;

  constructor() {
    const httpErrorHandler = this.httpErrorHandler;

    this.handlerError = httpErrorHandler.createHandleError('OwnerService');
  }

  getPetTypes(): Observable<PetType[]> {
    return this.http
      .get<PetType[]>(this.entityUrl)
      .pipe(catchError(this.handlerError('getPetTypes', [])));
  }

  getPetTypeById(typeId: string): Observable<PetType> {
    return this.http
      .get<PetType>(this.entityUrl + '/' + typeId)
      .pipe(catchError(this.handlerError('getPetTypeById', {} as PetType)));
  }

  updatePetType(typeId: string, petType: PetType): Observable<PetType> {
    return this.http
      .put<PetType>(this.entityUrl + '/' + typeId, petType)
      .pipe(catchError(this.handlerError('updatePetType', petType)));
  }

  addPetType(petType: PetType): Observable<PetType> {
    return this.http
      .post<PetType>(this.entityUrl, petType)
      .pipe(catchError(this.handlerError('addPetType', petType)));
  }

  deletePetType(typeId: string): Observable<number> {
    return this.http
      .delete<number>(this.entityUrl + '/' + typeId)
      .pipe(catchError(this.handlerError('deletePetType', 0)));
  }
}
