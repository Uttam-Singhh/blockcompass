import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule, ThemeService } from 'ng2-charts';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { ContentAnimateDirective } from './shared/directives/content-animate.directive';
import { ReportComponent } from './report/report.component';
import {HttpClientModule} from '@angular/common/http';
import {ChartsDemoModule} from "./charts/charts.module";
import {AngularEditorModule} from "@kolkov/angular-editor";

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        SidebarComponent,
        FooterComponent,
        DashboardComponent,
        SpinnerComponent,
        ContentAnimateDirective,
        ReportComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        ChartsModule,
        HttpClientModule,
        ChartsDemoModule,
        AngularEditorModule
    ],
    providers: [ThemeService],

    bootstrap: [AppComponent]
})
export class AppModule { }
