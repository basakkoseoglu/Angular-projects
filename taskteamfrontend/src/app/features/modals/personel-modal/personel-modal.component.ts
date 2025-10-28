import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonelCreateDto, PersonelReadDto, PersonelService, PersonelUpdateDto } from '../../../services/personels/personel.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personel-modal',
  templateUrl: './personel-modal.component.html',
  styleUrl: './personel-modal.component.css'
})
export class PersonelModalComponent implements OnInit{
  @Input() personel?: PersonelReadDto;

  personelForm!: FormGroup;
  loading = false;
  errorMessage = '';
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private personelService: PersonelService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.personel;

    this.personelForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      salary: [null, [Validators.required, Validators.min(0)]],
      password: ['']
    });
      if (this.isEditMode && this.personel) {
      this.personelForm.patchValue({
        firstName: this.personel.firstName,
        lastName: this.personel.lastName,
        email: this.personel.email,
        role: this.personel.role,
        salary: this.personel.salary
      });

      this.personelForm.get('email')?.disable();
    }
  }

  submitForm(): void {
    if (this.personelForm.invalid) {
      this.personelForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Eksik Bilgi',
        text: 'Lütfen tüm zorunlu alanları doldurun.',
        confirmButtonColor: '#188040'
      });
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.personel) {
      const dto: PersonelUpdateDto = {
        firstName: this.personelForm.value.firstName,
        lastName: this.personelForm.value.lastName,
        role: this.personelForm.value.role,
        salary: this.personelForm.value.salary
      };

      this.personelService.updatePersonel(this.personel.id, dto).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Personel Güncellendi!',
            showConfirmButton: false,
            timer: 1500
          });
          this.activeModal.close('updated');
        },
        error: (err) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: err.error?.message || 'Personel güncellenirken hata oluştu.',
            confirmButtonColor: '#d33'
          });
        }
      });
    } else {
      const dto: PersonelCreateDto = this.personelForm.value;
      this.personelService.addPersonel(dto).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Yeni Personel Eklendi!',
            showConfirmButton: false,
            timer: 1500
          });
          this.activeModal.close('created');
        },
        error: (err) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: err.error?.message || 'Personel eklenirken hata oluştu.',
            confirmButtonColor: '#d33'
          });
        }
      });
    }
  }
}