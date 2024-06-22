import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private timeout: any;
  private readonly timeoutDuration = 15 * 60 * 1000;

  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) { }

  generateToken(credentials: any) {
    return this.http.post('http://localhost:8080/token', credentials);
  }

  loginUser(token: string) {
    localStorage.setItem("token", token);
    this.startInactivityTimer();
    return true;
  }

  isLoggedIn(): boolean {
    let token = localStorage.getItem("token");
    if (token == undefined || token === '' || token == null) {
      return false;
    } else {
      this.resetInactivityTimer();
      return true;
    }
  }

  loggedOut() {
    localStorage.removeItem("token");
    clearTimeout(this.timeout);
    this.router.navigate(['/login']);
    return true;
  }

  getToken() {
    return localStorage.getItem("token");
  }

  private startInactivityTimer() {
    this.ngZone.runOutsideAngular(() => {
      this.timeout = setTimeout(() => {
        this.ngZone.run(() => this.logoutUser());
      }, this.timeoutDuration);
    });
  }

  private resetInactivityTimer() {
    clearTimeout(this.timeout);
    this.startInactivityTimer();
  }

  private async logoutUser() {
    location.reload();
    this.loggedOut();
    location.reload();
  }
}