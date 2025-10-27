import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-personel-modal',
  templateUrl: './personel-modal.component.html',
  styleUrl: './personel-modal.component.css'
})
export class PersonelModalComponent {
constructor(public activeModal: NgbActiveModal) {}
}
