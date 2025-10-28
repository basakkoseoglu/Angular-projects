import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectCreateDto, ProjectService } from '../../../services/projects/project.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.css']
})
export class ProjectModalComponent implements OnInit {

  @Input() projectId?: string;
  @Input() project?: ProjectCreateDto;

  projectForm!: FormGroup;
  loading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    if (this.project) {
      this.projectForm.patchValue({
        ProjectName: this.project.ProjectName,
        ProjectDescription: this.project.ProjectDescription,
        StartDate: this.project.StartDate
          ? new Date(this.project.StartDate).toISOString().substring(0, 10)
          : null,
        EndDate: this.project.EndDate
          ? new Date(this.project.EndDate).toISOString().substring(0, 10)
          : null,
        OwnerId: this.project.OwnerId
      });
    } else {
      this.loadUserId();
    }
  }

  private loadUserId(): void {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.projectForm.patchValue({ OwnerId: storedUserId });
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.projectForm.patchValue({ 
          OwnerId: payload.sub || payload.userId || payload.nameid || '' 
        });
      } catch (error) {
        console.error('Token parse hatası:', error);
      }
    }
  }

  private initForm(): void {
    this.projectForm = this.fb.group({
      ProjectName: ['', Validators.required],
      ProjectDescription: [''],
      OwnerId: [''],
      StartDate: [null],
      EndDate: [null]
    });
  }

  createProject(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Eksik Bilgi',
        text: 'Proje adı zorunludur!',
        confirmButtonColor: '#188040'
      });
      return;
    }

    const dto: ProjectCreateDto = this.projectForm.value;

    if (!dto.OwnerId) {
      Swal.fire({
        icon: 'error',
        title: 'Kullanıcı Bilgisi Eksik',
        text: 'Kullanıcı bilgisi alınamadı!',
        confirmButtonColor: '#188040'
      });
      return;
    }

    this.loading = true;

    if (this.projectId) {
      this.projectService.updateProject(this.projectId, dto).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Proje Güncellendi!',
            showConfirmButton: false,
            timer: 1500
          });
          this.activeModal.close('updated');
        },
        error: (err) => {
          this.loading = false;
          console.error('Proje güncellenemedi:', err);
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: err.error?.message || 'Proje güncellenemedi.',
            confirmButtonColor: '#d33'
          });
        }
      });
    } else {
      this.projectService.addProject(dto).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Proje Oluşturuldu!',
            showConfirmButton: false,
            timer: 1500
          });
          this.activeModal.close('created');
        },
        error: (err) => {
          this.loading = false;
          console.error('Proje oluşturulamadı:', err);
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: err.error?.message || 'Proje oluşturulamadı, lütfen tekrar deneyin.',
            confirmButtonColor: '#d33'
          });
        }
      });
    }
  }
}