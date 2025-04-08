import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreurNotificationComponent } from './livreur-notification.component';

describe('LivreurNotificationComponent', () => {
  let component: LivreurNotificationComponent;
  let fixture: ComponentFixture<LivreurNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LivreurNotificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivreurNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
