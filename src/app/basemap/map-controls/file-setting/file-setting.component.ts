import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-file-setting',
  templateUrl: './file-setting.component.html',
  styleUrls: ['./file-setting.component.scss']
})
export class FileSettingComponent implements OnInit {

  @Output() mapSettings: EventEmitter<{}> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeAndLogout() {
    this.mapSettings.emit(['closeAndLogout' , true]);
  }

  resetGrid() {
    this.mapSettings.emit(['resetGrid' , true]);
  }

  saveCurrentChanges() {
    this.mapSettings.emit(['saveCurrent' , true]);
  }

}
