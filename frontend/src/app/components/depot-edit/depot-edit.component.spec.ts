import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotEditComponent } from './depot-edit.component';

describe('DepotEditComponent', () => {
  let component: DepotEditComponent;
  let fixture: ComponentFixture<DepotEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepotEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepotEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
