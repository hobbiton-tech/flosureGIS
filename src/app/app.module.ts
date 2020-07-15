// tslint:disable-next-line: max-line-length
import { PolicyScheduleCombinedDocumentComponent } from './underwriting/documents/policy-schedule-combined-document/policy-schedule-combined-document.component';
import { PolicyScheduleDocumentComponent } from './underwriting/documents/policy-schedule-document/policy-schedule-document.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NavigationComponent } from './navigation/navigation.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { LoginComponent } from './login/login.component';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import 'firebase/storage';

import { SlackService } from './slack.service';

registerLocaleData(en);

// const firebaseConfig = {
//     apiKey: 'AIzaSyDzwhgLq4-nMHpJ1xldhHwPwpjOHc4sZV0',
//     authDomain: 'flosure-backend.firebaseapp.com',
//     databaseURL: 'https://flosure-backend.firebaseio.com',
//     projectId: 'flosure-backend',
//     storageBucket: 'flosure-backend.appspot.com',
//     messagingSenderId: '167483416678',
//     appId: '1:167483416678:web:dcd089c936275ee33f4da7',
//     measurementId: 'G-4565Y5EHD4'
// };

// const firebaseConfig = {
//     apiKey: 'AIzaSyCIwedzdF9Og67CsT8oChO8UkMBk1OVQPE',
//     authDomain: 'savenda-insurance.firebaseapp.com',
//     databaseURL: 'https://savenda-insurance.firebaseio.com',
//     projectId: 'savenda-insurance',
//     storageBucket: 'savenda-insurance.appspot.com',
//     messagingSenderId: '795733102142',
//     appId: '1:795733102142:web:62eaa45624e4473e35cb6f',
//     measurementId: 'G-SCN3RMBTB7',
// };

const firebaseConfig = {
    apiKey: "AIzaSyChAmlEMnEYeFe-s8gGE-tJcxN439XDPFU",
    authDomain: "golden-lotus-a6afc.firebaseapp.com",
    databaseURL: "https://golden-lotus-a6afc.firebaseio.com",
    projectId: "golden-lotus-a6afc",
    storageBucket: "golden-lotus-a6afc.appspot.com",
    messagingSenderId: "190302342488",
    appId: "1:190302342488:web:c7b69cdf194dfa439ce92d",
    measurementId: "G-1X9LY72JCD"
  };

@NgModule({
    declarations: [AppComponent, NavigationComponent, LoginComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgZorroAntdModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireStorageModule,
    ],
    providers: [{ provide: NZ_I18N, useValue: en_US }, SlackService],
    bootstrap: [AppComponent],
})
export class AppModule {}
