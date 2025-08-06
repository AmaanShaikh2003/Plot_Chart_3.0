import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatterOptionsComponent } from './formatter-options.component';

describe('FormatterOptionsComponent', () => {
  let component: FormatterOptionsComponent;
  let fixture: ComponentFixture<FormatterOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormatterOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormatterOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
