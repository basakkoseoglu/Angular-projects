import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
constructor(private authService:AuthService,private router:Router) { }

onSubmit() {
    if (!this.email || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Eksik Bilgi',
        text: 'Lütfen e-posta ve şifrenizi girin.',
        confirmButtonColor: '#188040'
      });
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login yanıtı:', response);

        localStorage.setItem('userId', response.userId);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('firstName', response.firstName);
        localStorage.setItem('lastName', response.lastName);

        Swal.fire({
          icon: 'success',
          title: `Hoşgeldin, ${response.firstName}!`,
          text: 'Giriş başarılı!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        console.error('Login hatası:', err);
        Swal.fire({
          icon: 'error',
          title: 'Giriş Başarısız!',
          text: err.error?.message || 'E-posta veya şifre hatalı.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
}