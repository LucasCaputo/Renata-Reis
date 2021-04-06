import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Login } from './login.interface';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { NewUser } from '../new-user/new-user.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  public postLogin(login: Login): Observable<Login> {
    return this.httpClient
      .post<Login>(environment.baseURL + '/user/login', login, this.httpOptions)
      .pipe(
        tap((response) => {
          this.authService.setUser(response);
        })
      );
  }
}