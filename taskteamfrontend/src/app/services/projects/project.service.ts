import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


export interface ProjectCreateDto {
  ProjectName: string;
  ProjectDescription?: string;
  OwnerId: string; 
  StartDate?: Date | null;
  EndDate?: Date | null;
}

export interface ProjectReadDto {
  id: string;                    
  projectName: string;           
  projectDescription: string;   
  ownerId: string;              
  startDate: string | null;     
  endDate: string | null;       
  isActive: boolean;            
  projectCreatedAt: string;     
  projectUpdatedAt: string;     
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
 private apiUrl = `${environment.apiUrl}/Project`;
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getAllProjects(): Observable<ProjectReadDto[]> {
    return this.http.get<ProjectReadDto[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addProject(dto: ProjectCreateDto): Observable<any> {
    return this.http.post(this.apiUrl, dto, { headers: this.getHeaders() });
  }

  updateProject(id: string, dto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto, { headers: this.getHeaders() });
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}

