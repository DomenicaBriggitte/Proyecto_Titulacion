import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroVolquetaComponent } from './registro-volqueta.component';

describe('RegistroVolquetaComponent', () => {
  let component: RegistroVolquetaComponent;
  let fixture: ComponentFixture<RegistroVolquetaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroVolquetaComponent]
    });
    fixture = TestBed.createComponent(RegistroVolquetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
