import {MatDialogRef} from "@angular/material";
import {Component} from "@angular/core";

@Component({
  selector: 'exit-editor-dialog',
  templateUrl: 'exit-editor-dialog.html',
})
export class ExitEditorDialog {

  constructor(
    public dialogRef: MatDialogRef<ExitEditorDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
