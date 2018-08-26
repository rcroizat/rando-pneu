import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import { SignaturePadModule } from 'angular2-signaturepad';


import { SignatureClient } from '../pages/signatures/client';
import { SignatureResponsable } from '../pages/signatures/responsable';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { AccueilPage } from '../pages/accueil/accueil';
import { ReglagePage } from '../pages/reglage/reglage';
import { FichePage } from '../pages/fiche/fiche';
import { DetailPage } from '../pages/fiche/detail/detail';
import { EditPage } from '../pages/fiche/edit/edit';
import { NouvelleFichePage } from '../pages/nouvelle-fiche/nouvelle-fiche';
import { FicheService } from '../services/fiches';
import { UserService } from '../services/user.service';

@NgModule({
  declarations: [
    MyApp,
    AccueilPage,
    FichePage,
    DetailPage,
    EditPage,
    ReglagePage,
    LoginPage,
    NouvelleFichePage,
    SignatureClient,
    SignatureResponsable
  ],
  imports: [
    BrowserModule,
    HttpModule,
    SignaturePadModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: 'Retour'
    }),
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['sqlite', 'websql', 'indexeddb']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AccueilPage,
    FichePage,
    LoginPage,
    DetailPage,
    EditPage,
    ReglagePage,
    NouvelleFichePage
  ],
  providers: [FicheService, UserService, {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
