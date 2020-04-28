import {BrowserModule} from "@angular/platform-browser";
import {NgModule, OnInit} from "@angular/core";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {BasemapComponent} from "./basemap/basemap.component";
import {
    MatBottomSheetModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatButtonToggleModule
} from "@angular/material";

import {HomeComponent} from "./home/home.component";
import {MapSettingComponent} from "./basemap/map-controls/map-setting/map-setting.component";
import {LegendComponent} from "./basemap/map-controls/legend/legend.component";
import {LayerControlComponent} from "./basemap/map-controls/layer-control/layer-control.component";
import {ConfigurationService} from "./services/configuration.service";
import {CityIOService} from "./services/cityio.service";
import {fakeBackendProvider} from "./interceptors/fake-backend";
import {JwtInterceptor} from "./interceptors/jwt.interceptor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ErrorInterceptor} from "./interceptors/error.interceptor";
import {ExitEditorDialog} from "./menus/exit-editor/exit-editor-dialog";
import {LocalStorageService} from "./services/local-storage.service";
import {RestoreMessage} from "./menus/restore-message/restore-message";
import {EditMenuComponent} from "./menus/edit-menu/edit-menu.component";
import {LoginDialog} from "./menus/login-menu/login.dialog";
import {ChartMenuComponent} from "./menus/chart-menu/chart-menu.component";
import { FileSettingComponent } from './basemap/map-controls/file-setting/file-setting.component';
import {ResetGridDialog} from "./menus/reset-grid/reset-grid-dialog";
import {AuthenticationService} from "./services/authentication.service";
import {ImprintComponent} from './imprint/imprint.component';

@NgModule({
    declarations: [
        AppComponent,
        BasemapComponent,
        HomeComponent,
        ImprintComponent,
        MapSettingComponent,
        LegendComponent,
        LayerControlComponent,
        ExitEditorDialog,
        ResetGridDialog,
        LoginDialog,
        EditMenuComponent,
        ChartMenuComponent,
        RestoreMessage,
        FileSettingComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatTabsModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatExpansionModule,
        MatButtonModule,
        MatSliderModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatRadioModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        FormsModule,
        MatBottomSheetModule,
        MatListModule,
        MatButtonToggleModule,
        ReactiveFormsModule
    ],
    exports: [MatSnackBarModule],
    providers: [
        AuthenticationService,
        HttpClientModule,
        CityIOService,
        ConfigurationService,
        LocalStorageService,
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        // provider used to create fake backend
        fakeBackendProvider
    ],
    entryComponents: [ExitEditorDialog, ResetGridDialog, LoginDialog, RestoreMessage],
    bootstrap: [AppComponent]
})
export class AppModule implements OnInit {
    ngOnInit() {
    }
}
