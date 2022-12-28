import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, mapTo, of, Subject, tap, throwError } from 'rxjs';
import { Sauce } from '../models/Sauce.model';
import { AuthService } from './auth.service';
const serverUrl: string = 'https://mkwebd-piiquante-back.cyclic.app/';
const serverUrlSauces: string = `${serverUrl}api/sauces/`;

@Injectable({
  providedIn: 'root',
})
export class SaucesService {
  sauces$ = new Subject<Sauce[]>();

  constructor(private http: HttpClient, private auth: AuthService) {}

  getSauces() {
    this.http
      .get<Sauce[]>(serverUrlSauces)
      .pipe(
        tap((sauces) => this.sauces$.next(sauces)),
        catchError((error) => {
          console.error(error.error.message);
          return of([]);
        })
      )
      .subscribe();
  }

  getSauceById(id: string) {
    return this.http
      .get<Sauce>(serverUrlSauces + id)
      .pipe(catchError((error) => throwError(error.error.message)));
  }

  likeSauce(id: string, like: boolean) {
    return this.http
      .post<{ message: string }>(serverUrlSauces + id + '/like', {
        userId: this.auth.getUserId(),
        like: like ? 1 : 0,
      })
      .pipe(
        mapTo(like),
        catchError((error) => throwError(error.error.message))
      );
  }

  dislikeSauce(id: string, dislike: boolean) {
    return this.http
      .post<{ message: string }>(serverUrlSauces + id + '/like', {
        userId: this.auth.getUserId(),
        like: dislike ? -1 : 0,
      })
      .pipe(
        mapTo(dislike),
        catchError((error) => throwError(error.error.message))
      );
  }

  createSauce(sauce: Sauce, image: File) {
    const formData = new FormData();
    formData.append('sauce', JSON.stringify(sauce));
    formData.append('image', image);
    return this.http
      .post<{ message: string }>(serverUrlSauces, formData)
      .pipe(catchError((error) => throwError(error.error.message)));
  }

  modifySauce(id: string, sauce: Sauce, image: string | File) {
    if (typeof image === 'string') {
      return this.http
        .put<{ message: string }>(serverUrlSauces + id, sauce)
        .pipe(catchError((error) => throwError(error.error.message)));
    } else {
      const formData = new FormData();
      formData.append('sauce', JSON.stringify(sauce));
      formData.append('image', image);
      return this.http
        .put<{ message: string }>(serverUrlSauces + id, formData)
        .pipe(catchError((error) => throwError(error.error.message)));
    }
  }

  deleteSauce(id: string) {
    return this.http
      .delete<{ message: string }>(serverUrlSauces + id)
      .pipe(catchError((error) => throwError(error.error.message)));
  }
}
