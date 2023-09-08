import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppointmentModalComponent } from './add-appointment-modal.component';

describe('AddAppointmentModalComponent', () => {
  let component: AddAppointmentModalComponent;
  let fixture: ComponentFixture<AddAppointmentModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddAppointmentModalComponent]
    });
    fixture = TestBed.createComponent(AddAppointmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
