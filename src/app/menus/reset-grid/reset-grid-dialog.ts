import {MatDialogRef} from "@angular/material";
import {Component} from "@angular/core";

@Component({
  selector: 'reset-grid-dialog',
  templateUrl: 'reset-grid-dialog.html',
})
export class ResetGridDialog {

  constructor(
    public dialogRef: MatDialogRef<ResetGridDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
