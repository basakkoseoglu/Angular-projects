import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = `${environment.apiUrl}/Upload`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiUrl, formData, {
      headers: this.getHeaders(),
    });
  }

  getFiles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  deleteFile(fileName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${fileName}`, {
      headers: this.getHeaders(),
    });
  }

  downloadFile(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${fileName}`, {
      headers: this.getHeaders(),
      responseType: 'blob',
    });
  }
}
