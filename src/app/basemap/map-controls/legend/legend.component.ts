import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import {CsLayer, Legend} from "../../../../typings";

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LegendComponent implements OnInit {
  @Input() layer: CsLayer;
  @Input() visible: boolean;
  @Output() close: EventEmitter<{}> = new EventEmitter();

  legend: Legend;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.visible) {
      this.legend = changes.layer.currentValue.legend ? changes.layer.currentValue.legend : null;
    }
  }

  onClose() {
    this.visible = false;
    this.close.emit();
  }

}
