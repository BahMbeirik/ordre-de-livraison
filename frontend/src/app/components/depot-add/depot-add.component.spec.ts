import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotAddComponent } from './depot-add.component';

describe('DepotAddComponent', () => {
  let component: DepotAddComponent;
  let fixture: ComponentFixture<DepotAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepotAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepotAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
