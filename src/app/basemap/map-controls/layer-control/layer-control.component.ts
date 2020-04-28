import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {CsLayer} from '../../../../typings';
import {FillExtrusionPaint} from 'mapbox-gl';
import {falseIfMissing} from 'protractor/built/util';

@Component({
  selector: 'app-layer-control',
  templateUrl: './layer-control.component.html',
  styleUrls: ['./layer-control.component.scss']
})
export class LayerControlComponent implements OnInit {
  @Input() layers: CsLayer[];
  @Output() toggleLayer: EventEmitter<{}> = new EventEmitter();
  @Output() showInfo: EventEmitter<CsLayer> = new EventEmitter();
  collapsedMain: boolean;
  openedGroupedLayers: CsLayer[];

  layerIcons = {
    walkability_adult: 'assets\\images\\icons_grasbrook_walkability_walk.svg',
    walkability_child: 'assets\\images\\icons_grasbrook_walkability_child.svg',
    walkability_wheelchair: 'assets\\images\\icons_grasbrook_walkability_accessible.svg',
  };

  selectedSublayers: object = {
    walkability: {},
    competition_designs: {}
  };

  // see config.json for defaults
  selectedSubResults: object = {
    walkability: '',
    competition_designs: '',
  };

  constructor() { }

  ngOnInit() {
  this.openedGroupedLayers = [];
  }

  onToggleLayer(layer: CsLayer, state?: boolean) {
    if (state !== undefined) {
      layer.visible = state;
    } else {
      layer.visible = !layer.visible;
    }

    this.toggleLayer.emit();
  }

  onShowInfo(evt: MouseEvent, layer: CsLayer) {
    evt.preventDefault();
    this.showInfo.emit(layer);
  }

  onCollapseGroupedLayer(layer: CsLayer) {
    // add to opened layers, if not opened yet
    if (!this.isLayerGroupOpened(layer)) {
      this.openedGroupedLayers.push(layer);
      return;
    }
    // remove from opened layers
    this.openedGroupedLayers.splice(this.openedGroupedLayers.indexOf(layer), 1);
  }

  isLayerGroupOpened(layer: CsLayer) {
    return this.openedGroupedLayers.indexOf(layer) >= 0;
  }

  onToggleSubLayer(layerId: string, subLayer: CsLayer) {
    if (subLayer.subResults.length > 0 && this.selectedSubResults[layerId] === '') {
      // do not toggle layer if subresult not specified
      this.setSelectedSublayer(layerId, subLayer);
      return;
    }

    // just toggle off if already visible
    if (subLayer.visible && (subLayer === this.selectedSublayers[layerId])) {
      this.onToggleLayer(subLayer, false);
      return;
    }

    // load new sublayer
    this.loadNewSubLayer(layerId, subLayer);

    // if grid layer was active, toggle Grid layer twice to put it on top of the layer stack
    if (subLayer.type === 'raster' && this.getGridLayer().visible) {
      this.reloadLayer(this.getGridLayer());
    }
  }

  onToggleSubResult(layerId: string, subResult: string) {
    const subLayer: CsLayer = this.selectedSublayers[layerId];
    const checkBoxUnchecked = (subResult === this.selectedSubResults[layerId]);
    const newSubResult  = !checkBoxUnchecked;

    if (checkBoxUnchecked) {
      this.updateSelectedSubResult(layerId, '');
    } else {
      // update selectedSubResult
      this.updateSelectedSubResult(layerId, subResult);
    }

    // layer is added to map first time
    if (!subLayer.visible && newSubResult) {
      this.updateSelectedSubResult(layerId, subResult);
      this.onToggleLayer(subLayer, true);
    }

    // remove layer from map
    if (subLayer.visible && checkBoxUnchecked) {
      this.onToggleLayer(subLayer, false);
    }

    // reload layer with new subResult
    if (subLayer.visible && newSubResult) {
      this.updateSelectedSubResult(layerId, subResult);
      this.reloadLayer(this.selectedSublayers[layerId]);
    }
  }

  /**
   * @param id
   * @return string?
   */
  findIconForLayerId(id: string) {
    return this.layerIcons[id];
  }

  private setSelectedSublayer(layerId: string, subLayer: CsLayer) {
    this.selectedSublayers[layerId] = subLayer;
  }

  private updateSelectedSubResult(mainLayerId: string, subResult: string) {
    this.selectedSubResults[mainLayerId] = subResult;
    if (this.selectedSublayers[mainLayerId].paint) {
      (this.selectedSublayers[mainLayerId].paint as FillExtrusionPaint)['fill-extrusion-color']['property'] = this.selectedSubResults[mainLayerId];
    }
  }

  private loadNewSubLayer(layerId: string, newSubLayer: CsLayer) {
    // turn off currently displayed sublayer
    this.onToggleLayer(this.selectedSublayers[layerId], false);
    // update subresult and turn on
    this.setSelectedSublayer(layerId, newSubLayer);
    this.updateSelectedSubResult(layerId, this.selectedSubResults[layerId]);
    this.onToggleLayer(newSubLayer, true);
  }

  private getGridLayer(): CsLayer {
    for (const layer of this.layers) {
      if (layer.id === 'grid') {
        return layer;
      }
    }
  }

  private reloadLayer(layer: CsLayer) {
    this.onToggleLayer(layer, false);
    this.onToggleLayer(layer, true);
  }

}
