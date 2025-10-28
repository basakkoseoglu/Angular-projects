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

  constructor(private router: Router, private authService: AuthService) { }
  ngOnInit(): void {
    this.firstName = localStorage.getItem('firstName');
    this.role = localStorage.getItem('role');
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
