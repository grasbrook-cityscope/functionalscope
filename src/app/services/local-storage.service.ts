import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  saveGrid(data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry>) {
    localStorage.removeItem('grid');
    localStorage.setItem('grid', JSON.stringify(data));
  }

  getGrid() {
    return JSON.parse(localStorage.getItem('grid'));
  }

  removeGrid() {
    localStorage.removeItem('grid');
  }

}
