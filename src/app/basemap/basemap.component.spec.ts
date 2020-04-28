import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasemapComponent } from './basemap.component';

describe('BasemapComponent', () => {
  let component: BasemapComponent;
  let fixture: ComponentFixture<BasemapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasemapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
