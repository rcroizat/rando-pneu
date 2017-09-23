import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';

import { UserService } from '../services/user.service';

import { FichePage } from '../pages/fiche/fiche';
import { LoginPage } from '../pages/login/login';
import { AccueilPage } from '../pages/accueil/accueil';
import { ReglagePage } from '../pages/reglage/reglage';
import { NouvelleFichePage } from '../pages/nouvelle-fiche/nouvelle-fiche';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  
  rootPage: any = NouvelleFichePage; // a commenter

  pages: Array<{title: string, component: any, icon: string}>;


  constructor(private _userService: UserService, public platform: Platform, public storage : Storage) {


    this.initializeApp();
    this.getRoot();


    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Accueil', component: AccueilPage, icon : 'md-home' },
      { title: 'Mes fiches', component: FichePage , icon : 'md-create' },
      { title: 'Nouvelle fiche', component: NouvelleFichePage, icon : 'md-document' },
      { title: 'Réglages', component: ReglagePage, icon : 'md-settings' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
  getRoot() {
    this.storage.ready().then(() => {
         this.storage.get('user').then((user) => {
          let pageP = user ? AccueilPage : LoginPage;
           this.nav.setRoot(pageP);
         })
     });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
