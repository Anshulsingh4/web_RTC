import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideMeetComponent } from './vide-meet.component';

describe('VideMeetComponent', () => {
  let component: VideMeetComponent;
  let fixture: ComponentFixture<VideMeetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideMeetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideMeetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
