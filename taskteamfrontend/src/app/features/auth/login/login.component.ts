import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

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
  this.authService.login({email:this.email, password:this.password}).subscribe({
    next: (response) => {

      console.log('Login yanıtı:', response);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      localStorage.setItem('firstName', response.firstName);
      alert('Login başarılı!');
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
        alert(err.error?.message || 'Login başarısız');
      }
  });
}
}