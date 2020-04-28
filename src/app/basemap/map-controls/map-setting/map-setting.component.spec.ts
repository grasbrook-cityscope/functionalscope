import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSettingComponent } from './map-setting.component';

describe('MapSettingComponent', () => {
  let component: MapSettingComponent;
  let fixture: ComponentFixture<MapSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
