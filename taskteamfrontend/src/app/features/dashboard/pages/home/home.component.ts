import { Component, OnInit } from '@angular/core';
import { TaskReadDto, TaskService } from '../../../../services/tasks/task.service';
import { ProjectService } from '../../../../services/projects/project.service';
import { PersonelService } from '../../../../services/personels/personel.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  loading = false;

  projectCount = 0;
  activePersonnelCount = 0;
  completedTaskCount = 0;
  inProgressTaskCount = 0;
  recentTasks: TaskReadDto[] = [];

  currentUser: any = null;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private personelService: PersonelService
  ) { }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    this.currentUser = { id: userId }; 
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;

    forkJoin({
      projects: this.projectService.getAllProjects(),
      tasks: this.taskService.getAllTasks(),
      personnels: this.personelService.getAllPersonels()
    }).subscribe({
      next: ({ projects, tasks, personnels }) => {
        this.projectCount = projects.length;
        this.activePersonnelCount = personnels.length;

        console.log("Current User ID:", this.currentUser?.id);
        console.log("Görevler:", tasks.map(t => t.assignedPersonnelId));

        const myTasks = this.currentUser?.id
          ? tasks.filter(t => t.assignedPersonnelId.toString().toLowerCase() === this.currentUser.id.toString().toLowerCase())
          : [];



        this.completedTaskCount = myTasks.filter(t => t.status === 'Tamamlandı').length;
        this.inProgressTaskCount = myTasks.filter(t => t.status === 'Devam Ediyor').length;

        this.recentTasks = myTasks
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Hata', 'Dashboard verileri alınamadı', 'error');
        console.error(err);
      }
    });
  }

  getBadgeClass(priority: string): string {
    switch (priority) {
      case 'Yüksek': return 'bg-danger text-white';
      case 'Orta': return 'bg-warning text-dark';
      default: return 'bg-success text-white';
    }
  }
}