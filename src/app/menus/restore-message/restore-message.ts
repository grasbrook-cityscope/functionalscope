import {MatBottomSheetRef} from "@angular/material";
import {Component} from "@angular/core";

@Component({
  selector: 'restore-message',
  templateUrl: 'restore-message.html',
})
export class RestoreMessage {
  constructor(private _bottomSheetRef: MatBottomSheetRef<RestoreMessage>) {}

  close(isRestore): void {
    this._bottomSheetRef.dismiss(isRestore);
  }
}
