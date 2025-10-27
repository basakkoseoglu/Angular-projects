import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  firstName: string | null = '';
  role: string | null = '';

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.firstName = localStorage.getItem('firstName');
    this.role = localStorage.getItem('role');
  }
logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('firstName');
    this.router.navigate(['/auth/login']);
  }
}
