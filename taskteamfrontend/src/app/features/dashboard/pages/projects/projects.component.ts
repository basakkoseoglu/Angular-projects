import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectModalComponent } from '../../../modals/project-modal/project-modal.component';
import { ProjectReadDto, ProjectService } from '../../../../services/projects/project.service';
import { PersonelReadDto, PersonelService } from '../../../../services/personels/personel.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  projects: ProjectReadDto[] = [];
  personnels: PersonelReadDto[] = [];
  loading = false;
  currentUser: any;
  private personnelNameMap: Record<string, string> = {};
  private personnelRoleMap: Record<string, string> = {};

  constructor(
    private projectService: ProjectService,
    private modalService: NgbModal,
    private personelService: PersonelService) { }

  ngOnInit(): void {
    this.currentUser = {
      id: localStorage.getItem('userId'),
      firstName: localStorage.getItem('firstName'),
      lastName: localStorage.getItem('lastName'),
      role: localStorage.getItem('role')
    };

    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    Promise.all([
      this.projectService.getAllProjects().toPromise(),
      this.personelService.getAllPersonels().toPromise()
    ])
      .then(([projects, personnels]) => {
        this.projects = projects || [];
        this.personnels = personnels || [];
        this.personnelNameMap = {};
        this.personnelRoleMap = {};
        this.personnels.forEach(p => {
        this.personnelNameMap[p.id] = `${p.firstName} ${p.lastName}`;
        this.personnelRoleMap[p.id] = p.role || 'Bilinmeyen Rol';
      });


        this.loading = false;
      })
      .catch((err) => {
        this.loading = false;
        console.error('Veriler alınamadı:', err);
        Swal.fire('Hata', 'Veriler alınamadı, lütfen tekrar deneyin.', 'error');
      });
  }

  getOwnerName(ownerId?: string): string {
    if (!ownerId) return 'Bilinmeyen Kullanıcı';
    return this.personnelNameMap[ownerId] ?? 'Bilinmeyen Kullanıcı';
  }

  getOwnerRole(ownerId?: string): string {
    if (!ownerId) return 'Bilinmeyen Rol';
    return this.personnelRoleMap[ownerId] ?? 'Bilinmeyen Rol';
  }

  openModal(): void {
    const modalRef = this.modalService.open(ProjectModalComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.result.then(
      (result) => {
        if (result === 'created') {
          Swal.fire({
            icon: 'success',
            title: 'Proje oluşturuldu!',
            showConfirmButton: false,
            timer: 1500
          });
          this.loadData();
        }
      },
      () => { }
    );
  }

  editProject(project: ProjectReadDto): void {
    const modalRef = this.modalService.open(ProjectModalComponent, {
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.project = {
      ProjectName: project.projectName,
      ProjectDescription: project.projectDescription,
      StartDate: project.startDate ? project.startDate.split('T')[0] : null,
      EndDate: project.endDate ? project.endDate.split('T')[0] : null,
      OwnerId: project.ownerId
    };
    modalRef.componentInstance.projectId = project.id;

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          Swal.fire({
            icon: 'success',
            title: 'Proje güncellendi!',
            showConfirmButton: false,
            timer: 1500
          });
          this.loadData();
        }
      },
      () => { }
    );
  }

  deleteProject(id: string): void {
    Swal.fire({
      title: 'Emin misiniz?',
      text: 'Bu proje kalıcı olarak silinecek!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.deleteProject(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Proje silindi!',
              showConfirmButton: false,
              timer: 1500
            });
            this.loadData();
          },
          error: (err) => {
                      console.error('Silme hatası:', err);
                      
                      if (err.status === 403) {
                        Swal.fire({
                          icon: 'error',
                          title: 'Yetkiniz Yok',
                          text: 'Bu projeyi silme yetkiniz bulunmamaktadır.',
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
                          text: 'Proje bulunamadı.',
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

  formatDate(date: string | null): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR');
  }
}