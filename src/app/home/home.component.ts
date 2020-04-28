import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {MatDialog} from "@angular/material";
import {LoginDialog} from "../menus/login-menu/login.dialog";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    private loginStatus: boolean;
    private locationsSubscription;


    constructor(private authenticationService: AuthenticationService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.locationsSubscription = this.authenticationService.currentUser.subscribe({
            next: user => this.loginStatus =  user != null
        });
    }

    logout() {
        this.authenticationService.logout();
    }

    login(): void {
        const dialogRef = this.dialog.open(LoginDialog, {
            width: '600px',
            autoFocus: true,
            panelClass: 'login-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            // Potential exit actions
        });
    }
}
