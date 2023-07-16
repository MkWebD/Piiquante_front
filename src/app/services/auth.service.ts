import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
const serverUrl: string = 'https://server.kevinmas.com/piiquante/';
const serverUrlAuth: string = `${serverUrl}api/auth/`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken = '';
  private userId = '';

  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string) {
    return this.http.post<{ message: string }>(`${serverUrlAuth}signup`, {
      email: email,
      password: password,
    });
  }

  getToken() {
    return this.authToken;
  }

  getUserId() {
    return this.userId;
  }

  loginUser(email: string, password: string) {
    return this.http
      .post<{ userId: string; token: string }>(`${serverUrlAuth}login`, {
        email: email,
        password: password,
      })
      .pipe(
        tap(({ userId, token }) => {
          this.userId = userId;
          this.authToken = token;
          this.isAuth$.next(true);
        })
      );
  }

  logout() {
    this.authToken = '';
    this.userId = '';
    this.isAuth$.next(false);
    this.router.navigate(['login']);
  }
}
