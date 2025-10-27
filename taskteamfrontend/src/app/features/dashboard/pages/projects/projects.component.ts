import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectModalComponent } from '../../../modals/project-modal/project-modal.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
constructor(private modalService: NgbModal) {}
openModal() {
    this.modalService.open(ProjectModalComponent, { size: 'lg' });
  }
}
