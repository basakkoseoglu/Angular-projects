import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectModalComponent } from './project-modal/project-modal.component';
import { TaskModalComponent } from './task-modal/task-modal.component';
import { PersonelModalComponent } from './personel-modal/personel-modal.component';

@NgModule({
  declarations: [
    ProjectModalComponent,
    TaskModalComponent,
    PersonelModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  exports: [
    ProjectModalComponent,
    TaskModalComponent,
    PersonelModalComponent
  ]
})
export class ModalsModule {}
