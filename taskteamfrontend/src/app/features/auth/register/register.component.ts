import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  firstname="";
  lastname="";
  email="";
  password="";
  role="";
  salary=0;

  constructor(private authService:AuthService,private router:Router) { }

  onSubmit() {
    if (!this.firstname || !this.lastname || !this.email || !this.password ) {
      Swal.fire({
        icon: 'warning',
        title: 'Eksik Bilgi',
        text: 'Lütfen tüm zorunlu alanları doldurun.',
        confirmButtonColor: '#188040'
      });
      return;
    }

    Swal.fire({
      title: 'Kayıt oluşturuluyor...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.register({
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
      role: this.role,
      salary: this.salary
    }).subscribe({
      next: (response) => {
        console.log('Kayıt yanıtı:', response);

        localStorage.setItem('userId', response.userId);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('firstName', this.firstname);
        localStorage.setItem('lastName', this.lastname);

        Swal.fire({
          icon: 'success',
          title: 'Kayıt Başarılı!',
          text: `Hoş geldin, ${this.firstname}!`,
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Kayıt Başarısız!',
          text: err.error?.message || 'Bir hata oluştu, lütfen tekrar deneyin.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
}