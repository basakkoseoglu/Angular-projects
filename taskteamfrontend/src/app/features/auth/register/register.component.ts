import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

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
  this.authService.register({firstname:this.firstname, lastname:this.lastname,email:this.email,password:this.password,role:this.role,salary:this.salary}).subscribe({
    next: (response) => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      alert('Kayıt başarılı!');
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
        alert(err.error?.message || 'kayıt başarısız');
      }
  });
}
}
