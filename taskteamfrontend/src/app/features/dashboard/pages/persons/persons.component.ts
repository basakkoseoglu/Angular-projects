import { Component, OnInit } from '@angular/core';
import { PersonelModalComponent } from '../../../modals/personel-modal/personel-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonelReadDto, PersonelService } from '../../../../services/personels/personel.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.css'
})
export class PersonsComponent implements OnInit {
  personeller: PersonelReadDto[] = [];
  filteredPersoneller: PersonelReadDto[] = [];
  loading = false;
  searchTerm = '';

  constructor(
    private modalService: NgbModal,
    private personelService: PersonelService
  ) { }

  ngOnInit(): void {
    this.getAllPersonels();
  }

  getAllPersonels(): void {
    this.loading = true;
    this.personelService.getAllPersonels().subscribe({
      next: (data) => {
        this.personeller = data;
        this.filteredPersoneller = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Hata', 'Personel listesi alınamadı', 'error');
        console.error('Personel listesi alınamadı', err);
      }
    });
  }

  openModal(): void {
    const modalRef = this.modalService.open(PersonelModalComponent, {
      size: 'lg',
      backdrop: 'static',
      centered:true
    });

    modalRef.result
      .then((result) => {
        if (result === 'created') this.getAllPersonels();
      })
      .catch(() => { });
  }
  editPersonel(personel: PersonelReadDto): void {
    const modalRef = this.modalService.open(PersonelModalComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.personel = personel;

    modalRef.result
      .then((result) => {
        if (result === 'updated') this.getAllPersonels();
      })
      .catch(() => { });
  }

  search(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredPersoneller = this.personeller.filter((p) =>
      [p.firstName, p.lastName, p.email, p.role].some((field) =>
        field.toLowerCase().includes(term)
      )
    );
  }

  deletePersonel(id: string): void {
    Swal.fire({
      title: 'Emin misiniz?',
      text: 'Bu personel kalıcı olarak silinecek!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, sil',
      cancelButtonText: 'İptal'
    }).then((res) => {
      if (res.isConfirmed) {
        this.personelService.deletePersonel(id).subscribe({
          next: () => {
            Swal.fire('Silindi', 'Personel başarıyla silindi.', 'success');
            this.getAllPersonels();
          },
          error: () => {
            Swal.fire('Hata', 'Silme işlemi başarısız.', 'error');
          }
        });
      }
    });
  }
}