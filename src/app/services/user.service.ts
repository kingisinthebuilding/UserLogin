import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getUser() {
    return this.http.get('http://localhost:8080/getusers')
  }

  public saveUser(userDetails: any) {
    return this.http.post('http://localhost:8080/addUser', userDetails)
  }

  getData() {
    return this.http.get('http://localhost:8080/product');
  }

  status(productId: number, status: any) {
    return this.http.get(`http://localhost:8080/status/${productId}`, status).subscribe((response: any) => {
      console.log(response);
    },
      (error: any) => {
        console.log(error);
      })
  }

  updateProductStatus(productId: number, status: string): Observable<any> {
    if (productId !== undefined && productId > 0) {
      return this.http.post('http://localhost:8080/status/1', { status });
    }
    else {
      return new Observable(observer => observer.error('Invalid productId'));
    }
  }
}