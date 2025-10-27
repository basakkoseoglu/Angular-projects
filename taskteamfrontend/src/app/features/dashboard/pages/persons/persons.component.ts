import { Component } from '@angular/core';
import { PersonelModalComponent } from '../../../modals/personel-modal/personel-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.css'
})
export class PersonsComponent {
  constructor(private modalService: NgbModal) {}
openModal() {
    this.modalService.open(PersonelModalComponent, { size: 'lg' });
  }
}
