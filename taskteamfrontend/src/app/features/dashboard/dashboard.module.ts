import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PersonsComponent } from './pages/persons/persons.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalsModule } from '../modals/modals.module';

@NgModule({
  declarations: [
    LayoutComponent,
    HomeComponent,
    ProjectsComponent,
    TasksComponent,
    PersonsComponent
    ],
  imports: [CommonModule, DashboardRoutingModule,FormsModule,NgbModule,ModalsModule,ReactiveFormsModule]
})
export class DashboardModule {}
