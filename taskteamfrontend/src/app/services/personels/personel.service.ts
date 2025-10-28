import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PersonelReadDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  salary: number;
  createdAt: string;
}

export interface PersonelCreateDto {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  salary: number;
  password: string; 
}

export interface PersonelUpdateDto {
  firstName: string;
  lastName: string;
  role: string;
  salary: number;
}

@Injectable({
  providedIn: 'root'
})
export class PersonelService {
 private apiUrl = `${environment.apiUrl}/Personel`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('token'); 
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      });
    }

   getAllPersonels(): Observable<PersonelReadDto[]> {
        return this.http.get<PersonelReadDto[]>(this.apiUrl, { headers: this.getHeaders() });
      }
    
    addPersonel(dto: PersonelCreateDto): Observable<any> {
        return this.http.post(this.apiUrl, dto, { headers: this.getHeaders() });
      }
    
    updatePersonel(id: string, dto: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, dto, { headers: this.getHeaders() });
      }
    
    deletePersonel(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
      }
    }
