import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvasoresComponent } from './invasores.component';

describe('InvasoresComponent', () => {
  let component: InvasoresComponent;
  let fixture: ComponentFixture<InvasoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvasoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvasoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
