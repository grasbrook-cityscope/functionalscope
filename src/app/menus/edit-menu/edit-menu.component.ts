import {Component, Input, OnInit, Output, EventEmitter, OnDestroy, ViewChild} from '@angular/core';
import {MapEntity} from "../../entities/MapEntity";
import { MatSelect } from '@angular/material';

@Component({
    selector: 'app-edit-menu',
    templateUrl: './edit-menu.component.html',
    styleUrls: ['./edit-menu.component.scss']
})
export class EditMenuComponent implements OnInit {

    @Input() currentCell: MapEntity; // todo: is this needed?
    @Output() menuOutput = new EventEmitter<MapEntity>();
    @Output() dismissMenu: EventEmitter<any> = new EventEmitter();
    @ViewChild('selectGroundUse', {static: false}) selectGU: MatSelect;
    @ViewChild('selectUpperUse', {static: false}) selectUU: MatSelect;
    @ViewChild('selectOSType', {static: false}) selectOST: MatSelect;
    cell: MapEntity = new MapEntity();
    isDismissed = false;
    sliderDisabled = true;
    speedLimitDisabled = true;
    pedestrianDisabled = false;

    streettype = 'promenade';

    constructor() {
    }

    ngOnInit() {
        if (this.currentCell) {
            this.cell = Object.assign({}, this.currentCell);
            if (this.cell.bld_numLevels > 1) {
                this.sliderDisabled = false;
            }
            // if (this.cell.str_numLanes > 0) {
            //     this.pedestrianDisabled = true;
            //     this.cell.str_ramp = false;
            //     this.cell.str_stairs = false;
            //     this.cell.str_elevator = false;

            //     if (this.cell.str_speed === 7) {
            //         this.streettype = 'pedestrian';
            //     } else if (this.cell.str_speed === 30) {
            //         this.streettype = 'bike';
            //     } else {
            //         this.streettype = 'car';
            //     }
            // }
        }
    }

    onChangeSetCellType(event: any) {
        const idx = Number.parseInt(event);
        if (idx > -1 && idx <= 3) {
            this.cell.type = event;
        }
    }

    onChangeSlider(event: any) {
        if (event.value === 1) {
            this.sliderDisabled = true;
            this.cell.bld_useUpper = null;
        } else {
            this.sliderDisabled = false;
        }
    }

    onChangeLanes(laneCount: number) {
        // if (laneCount === 0) {
        //     this.speedLimitDisabled = true;
        //     this.cell.str_speed = 7;
        // } else {
        //     this.speedLimitDisabled = false;
        //     this.cell.str_ramp = false;
        //     this.cell.str_stairs = false;
        //     this.cell.str_elevator = false;
        // }

    }

    onChangeStrType(value: number) {
        // switch (String(value)) {
        //     case 'promenade':
        //         this.speedLimitDisabled = true;
        //         this.pedestrianDisabled = false;
        //         this.cell.str_numLanes = 0;
        //         this.cell.str_speed = 0;
        //         this.cell.str_bike = true;
        //         break;
        //     case 'pedestrian':
        //         this.speedLimitDisabled = false;
        //         this.pedestrianDisabled = true;
        //         this.cell.str_numLanes = 1;
        //         this.cell.str_speed = 7;
        //         this.cell.str_bike = true;
        //         this.cell.str_ramp = false;
        //         this.cell.str_stairs = false;
        //         this.cell.str_elevator = false;
        //         break;
        //     case 'bike':
        //         this.speedLimitDisabled = false;
        //         this.pedestrianDisabled = true;
        //         this.cell.str_numLanes = 1;
        //         this.cell.str_speed = 30;
        //         this.cell.str_bike = true;
        //         this.cell.str_ramp = false;
        //         this.cell.str_stairs = false;
        //         this.cell.str_elevator = false;
        //         break;
        //     case 'car':
        //         this.speedLimitDisabled = false;
        //         this.pedestrianDisabled = true;
        //         this.cell.str_numLanes = 2;
        //         this.cell.str_speed = 50;
        //         this.cell.str_bike = false;
        //         this.cell.str_ramp = false;
        //         this.cell.str_stairs = false;
        //         this.cell.str_elevator = false;
        //         break;
        // }
    }

    // Button actions

    onCancel() {
        this.isDismissed = true;
        this.dismissMenu.emit(null);
    }

    onSave() {
        if (this.cell.type === 0 && this.cell.bld_useGround == null) {
            this.selectGU.open();
            this.selectGU.close();
            return;
        } else if (this.cell.type === 0 && this.cell.bld_numLevels > 1 && this.cell.bld_useUpper == null) {
            this.selectUU.open();
            this.selectUU.close();
            return;
        } 
        // else if (this.cell.type === 2 && this.cell.os_type == null) {
        //     this.selectOST.open();
        //     this.selectOST.close();
        //     return;
        // }
        this.isDismissed = true;
        this.dismissMenu.emit(this.cell);
    }

    ngOnDestroy() {
        // WHAT TO DO HERE????
        if (!this.isDismissed) {
            this.menuOutput.emit(this.cell);
        }
    }

}
