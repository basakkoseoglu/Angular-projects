import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskModalComponent } from '../../../modals/task-modal/task-modal.component';
import Swal from 'sweetalert2';
import { TaskReadDto, TaskService } from '../../../../services/tasks/task.service';
import { ProjectReadDto, ProjectService } from '../../../../services/projects/project.service';
import { PersonelReadDto, PersonelService } from '../../../../services/personels/personel.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  tasks: TaskReadDto[] = [];
  filteredTasks: TaskReadDto[] = [];
  searchTerm = '';
  loading = false;

  private projectNameMap: Record<string, string> = {};
  private personnelNameMap: Record<string, string> = {};
  constructor(
    private modalService: NgbModal,
    private taskService: TaskService,
    private projectService: ProjectService,
    private personelService: PersonelService
  ) { }

  ngOnInit(): void {

    this.loading = true;
    forkJoin({
      projects: this.projectService.getAllProjects(),
      personnels: this.personelService.getAllPersonels()
    }).subscribe({
      next: ({ projects, personnels }) => {

        this.projectNameMap = (projects || []).reduce((acc: Record<string, string>, p: ProjectReadDto) => {
          acc[p.id] = p.projectName;
          return acc;
        }, {});
        this.personnelNameMap = (personnels || []).reduce((acc: Record<string, string>, per: PersonelReadDto) => {
          acc[per.id] = `${per.firstName} ${per.lastName}`;
          return acc;
        }, {});

        this.loadTasks();
      },
      error: () => {
        this.loading = false;
        Swal.fire('Hata', 'Proje/Personel listeleri alınamadı', 'error');
      }
    });
  }

  private loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.filteredTasks = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Hata', 'Görev listesi alınamadı', 'error');
      }
    });
  }

  getProjectName(projectId?: string): string {
    if (!projectId) return '';
    return this.projectNameMap[projectId] || '';
  }

  getPersonnelName(personnelId?: string): string {
    if (!personnelId) return '';
    return this.personnelNameMap[personnelId] || '';
  }

  getAllTasks(): void {
    this.loading = true;
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.filteredTasks = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Hata', 'Görev listesi alınamadı', 'error');
      }
    });
  }

  openModal(): void {
    const modalRef = this.modalService.open(TaskModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.result.then((result) => {
      if (result === 'created') this.getAllTasks();
    }).catch(() => { });
  }

  editTask(task: TaskReadDto): void {
    const modalRef = this.modalService.open(TaskModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.task = task;
    modalRef.result.then((result) => {
      if (result === 'updated') this.getAllTasks();
    }).catch(() => { });
  }

  deleteTask(id: string): void {
    Swal.fire({
      title: 'Emin misiniz?',
      text: 'Bu görev kalıcı olarak silinecek!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((res) => {
      if (res.isConfirmed) {
        this.taskService.deleteTask(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Silindi!',
              text: 'Görev başarıyla silindi.',
              showConfirmButton: false,
              timer: 1500
            });
            this.getAllTasks();
          },
          error: (err) => {
            console.error('Silme hatası:', err);
            
            if (err.status === 403) {
              Swal.fire({
                icon: 'error',
                title: 'Yetkiniz Yok',
                text: 'Bu görevi silme yetkiniz bulunmamaktadır.',
                confirmButtonColor: '#d33'
              });
            } else if (err.status === 401) {
              Swal.fire({
                icon: 'warning',
                title: 'Oturum Süreniz Doldu',
                text: 'Lütfen tekrar giriş yapın.',
                confirmButtonColor: '#3085d6'
              });
            } else if (err.status === 404) {
              Swal.fire({
                icon: 'error',
                title: 'Bulunamadı',
                text: 'Görev bulunamadı.',
                confirmButtonColor: '#d33'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: err.error?.message || 'Silme işlemi başarısız oldu.',
                confirmButtonColor: '#d33'
              });
            }
          }
        });
      }
    });
  }

  search(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredTasks = this.tasks.filter(t =>
      t.taskTitle.toLowerCase().includes(term) ||
      t.taskDescription.toLowerCase().includes(term) ||
      t.priority.toLowerCase().includes(term)
    );
  }
}
