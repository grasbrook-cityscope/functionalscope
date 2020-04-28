import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable, of} from "rxjs";
import {map} from "rxjs/operators";
import {catchError, tap} from 'rxjs/internal/operators';
import {User} from "../models/user";
import {MatSnackBar} from "@angular/material";
import {AlertService} from "./alert.service";

@Injectable({
    providedIn: "root"
})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public auth_url = `https://cityio.media.mit.edu/users/authenticate`;

    constructor(private http: HttpClient,
                private alertService: AlertService) {
        this.currentUserSubject = new BehaviorSubject<User>(
            JSON.parse(localStorage.getItem("currentUser"))
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username, password) {
        const httpOptions = {
            headers: new HttpHeaders({
                    'username' : username,
                    'password' : password
            })
        };

        return this.http
            .post<any>(this.auth_url, {}, httpOptions)
            .pipe(
                map(user => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem("currentUser", JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    this.alertService.success("Designer Login successful", "");
                    return user;
                })
            );
    }

    logout(pathname?: string) {
        // remove user from local storage and set current user to null
        localStorage.removeItem("currentUser");
        this.currentUserSubject.next(null);

        switch (pathname) {
            case '/login':
                this.alertService.error('Login failed', 'Username or password are wrong', 5000);
                break;
            default:
                this.alertService.success('Logout successful', '');
                break;
        }
    }
}
