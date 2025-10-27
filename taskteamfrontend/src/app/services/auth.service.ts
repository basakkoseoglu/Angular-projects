import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;
  constructor(private http:HttpClient) { }

  login(data:{email:string, password:string}):Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }
  
  register(data:{firstname:string, lastname:string, email:string,password:string,role:string,salary:number}):Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
     localStorage.removeItem('firstName');
  }

}
