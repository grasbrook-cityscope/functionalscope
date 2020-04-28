import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartMenuComponent } from './chart-menu.component';

describe('ChartMenuComponent', () => {
  let component: ChartMenuComponent;
  let fixture: ComponentFixture<ChartMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
