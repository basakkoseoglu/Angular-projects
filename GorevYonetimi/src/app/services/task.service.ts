import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5045/api/Task';
  constructor(
    private http: HttpClient
  ) { }

  getTasks():Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  addTask(task: Task):Observable<any> {
    return this.http.post<any>(this.apiUrl, task);
  }
  updateTask(id: number, task: Task): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
