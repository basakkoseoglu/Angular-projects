import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TaskReadDto {
  id: string;
  projectId: string;
  assignedPersonnelId: string;
  taskTitle: string;
  taskDescription: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateDto {
  projectId: string;
  assignedPersonnelId: string;
  taskTitle: string;
  taskDescription: string;
  priority: string;
}

export interface TaskUpdateDto {
  taskTitle: string;
  taskDescription: string;
  status: string;
  priority: string;
  assignedPersonnelId: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/Task`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getAllTasks(): Observable<TaskReadDto[]> {
    return this.http.get<TaskReadDto[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addTask(dto: TaskCreateDto): Observable<any> {
    return this.http.post(this.apiUrl, dto, { headers: this.getHeaders() });
  }

  updateTask(id: string, dto: TaskUpdateDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto, { headers: this.getHeaders() });
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}