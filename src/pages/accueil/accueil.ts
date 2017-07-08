import { Component } from '@angular/core';

import { NavController, MenuController } from 'ionic-angular';

import { NouvelleFichePage } from '../nouvelle-fiche/nouvelle-fiche';
import { ReglagePage } from '../reglage/reglage';
import { FichePage } from '../fiche/fiche';


@Component({
  selector: 'accueil',
  templateUrl: 'accueil.html'
})
export class AccueilPage {


  pages: Array<{title: string, component: any}>;



  constructor(public navCtrl: NavController, private menu: MenuController) {
    this.menu = menu;
    this.menu.swipeEnable(false);
  }

  mesFiches(){
    this.navCtrl.setRoot(FichePage);
    this.menu.swipeEnable(true);
  }

  reglages(){
    this.navCtrl.setRoot(ReglagePage);
    this.menu.swipeEnable(true);
  }
  
  nouvelleFiche(){
    this.navCtrl.setRoot(NouvelleFichePage);
    this.menu.swipeEnable(true);
  }
}
