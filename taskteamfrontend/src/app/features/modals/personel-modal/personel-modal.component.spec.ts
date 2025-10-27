import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonelModalComponent } from './personel-modal.component';

describe('PersonelModalComponent', () => {
  let component: PersonelModalComponent;
  let fixture: ComponentFixture<PersonelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonelModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
