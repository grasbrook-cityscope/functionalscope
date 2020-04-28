import {MatDialogRef} from "@angular/material";
import {Component} from "@angular/core";
import {first} from "rxjs/operators";
import {AuthenticationService} from "../../services/authentication.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../services/alert.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'login-dialog',
    templateUrl: 'login.dialog.html',
    styleUrls: ['login.dialog.scss']
})
export class LoginDialog {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl = 'http://localhost:4200/map';
    state: string;

    constructor(public dialogRef: MatDialogRef<LoginDialog>,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,) {

    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/map';
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.loading = false;
                    this.dialogRef.close();
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error("Login failed. Please check your credentials", "", 5000)
                    this.loading = false;
                });
    }
}
