import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskCreateDto, TaskReadDto, TaskService, TaskUpdateDto } from '../../../services/tasks/task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonelReadDto, PersonelService } from '../../../services/personels/personel.service';
import { ProjectReadDto, ProjectService } from '../../../services/projects/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css'
})
export class TaskModalComponent implements OnInit {
  @Input() task?: TaskReadDto;

  taskForm!: FormGroup;
  isEditMode = false;
  loading = false;

  projects: ProjectReadDto[] = [];
  personnels: PersonelReadDto[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private projectService: ProjectService,
    private personelService: PersonelService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.task;

    this.taskForm = this.fb.group({
      projectId: ['', Validators.required],
      assignedPersonnelId: ['', Validators.required],
      taskTitle: ['', Validators.required],
      taskDescription: ['', Validators.required],
      priority: ['Orta', Validators.required],
      status: [this.isEditMode ? this.task?.status : 'Yeni']
    });

    if (this.isEditMode && this.task) {
      this.taskForm.patchValue(this.task);
    }

    this.loadProjects();
    this.loadPersonnels();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data) => (this.projects = data),
      error: () => console.error('Projeler alınamadı')
    });
  }

  loadPersonnels(): void {
    this.personelService.getAllPersonels().subscribe({
      next: (data) => (this.personnels = data),
      error: () => console.error('Personeller alınamadı')
    });
  }

  submitForm(): void {
    if (this.taskForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Eksik Bilgi',
        text: 'Lütfen tüm zorunlu alanları doldurun.',
        confirmButtonColor: '#188040'
      });
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.task) {
      const dto: TaskUpdateDto = this.taskForm.value;
      this.taskService.updateTask(this.task.id, dto).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Görev Güncellendi!',
            showConfirmButton: false,
            timer: 1500
          });
          this.activeModal.close('updated');
        },
        error: (err) => {
          this.loading = false;
          console.error('Görev güncellenemedi:', err);
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: err.error?.message || 'Görev güncellenemedi, lütfen tekrar deneyin.',
            confirmButtonColor: '#d33'
          });
        }
      });
    } else {
      const dto: TaskCreateDto = this.taskForm.value;
      this.taskService.addTask(dto).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Görev Oluşturuldu!',
            showConfirmButton: false,
            timer: 1500
          });
          this.activeModal.close('created');
        },
        error: (err) => {
          this.loading = false;
          console.error('Görev oluşturulamadı:', err);
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: err.error?.message || 'Görev oluşturulamadı, lütfen tekrar deneyin.',
            confirmButtonColor: '#d33'
          });
        }
      });
    }
  }
}