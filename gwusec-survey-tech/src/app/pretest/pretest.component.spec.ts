import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PretestComponent } from './pretest.component';

describe('PretestComponent', () => {
  let component: PretestComponent;
  let fixture: ComponentFixture<PretestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PretestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PretestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
