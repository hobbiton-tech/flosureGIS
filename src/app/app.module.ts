// tslint:disable-next-line: max-line-length
import { PolicyScheduleCombinedDocumentComponent } from './underwriting/documents/policy-schedule-combined-document/policy-schedule-combined-document.component';
import { PolicyScheduleDocumentComponent } from './underwriting/documents/policy-schedule-document/policy-schedule-document.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NavigationComponent } from './navigation/navigation.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { LoginComponent } from './login/login.component';
import { AngularFireStorageModule} from '@angular/fire/storage';
import 'firebase/storage';

import { SlackService } from './slack.service';
import { NzListModule } from 'ng-zorro-antd/list';
import { JwtInterceptor } from './users/helpers/jwt.interceptor';
import { ErrorInterceptor } from './users/helpers/error.interceptor';
import {
  NzButtonModule,
  NzFormModule,
  NzIconModule,
  NzInputModule,
  NzLayoutModule,
  NzMenuModule,
  NzMessageModule,
  NzSpinModule
} from 'ng-zorro-antd';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';

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

// const firebaseConfig = {
//     apiKey: 'AIzaSyA4otys77Tb4bX7uXJONdquRlj0HCzzn1M',
//     authDomain: 'aplus-insurance.firebaseapp.com',
//     databaseURL: 'https://aplus-insurance.firebaseio.com',
//     projectId: 'aplus-insurance',
//     storageBucket: 'aplus-insurance.appspot.com',
//     messagingSenderId: '526693014551',
//     appId: '1:526693014551:web:edce6fd10c1c52742dd052',
//     measurementId: 'G-GNB5VZE6XQ'
// };

@NgModule({
    declarations: [AppComponent, NavigationComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    NzListModule,
    NzLayoutModule,
    NzSpinModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzMessageModule,
    NzMenuModule,
    NzIconModule
  ],
    providers: [
      SlackService,
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      { provide: NZ_I18N, useValue: en_US }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
