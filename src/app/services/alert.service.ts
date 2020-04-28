import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private _snackBar: MatSnackBar) {
  }

  success(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  error(message: string, action: string, time: number) {
    let timer = time ? time : 5000;
    this._snackBar.open(message, action, {
      duration: timer,
      panelClass: ['error-snackbar']
    });
  }

  dismiss() {
    this._snackBar.dismiss();
  }

}
