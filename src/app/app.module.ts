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
import { RatesComponent } from './app/settings/components/rates/rates.component';
import { GraphQLModule } from './graphql.module';
import { SlackService } from './slack.service';

registerLocaleData(en);

const firebaseConfig = {
    apiKey: "AIzaSyCex2KRIQS6ZFM7BnIIfHzM1Zn31hd5rl4",
    authDomain: "flosure-golden-lotus.firebaseapp.com",
    databaseURL: "https://flosure-golden-lotus.firebaseio.com",
    projectId: "flosure-golden-lotus",
    storageBucket: "flosure-golden-lotus.appspot.com",
    messagingSenderId: "586554297839",
    appId: "1:586554297839:web:32083a80f3f6e0511a7a1a",
    measurementId: "G-ZQGFJ0M16G"
  };

@NgModule({
    declarations: [
        AppComponent,
        NavigationComponent,
        LoginComponent,
        RatesComponent,
    ],
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
        GraphQLModule,
    ],
    providers: [{ provide: NZ_I18N, useValue: en_US }, SlackService],
    bootstrap: [AppComponent],
})
export class AppModule {}
