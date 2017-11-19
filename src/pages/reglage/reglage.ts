import { Component } from '@angular/core';

import { NavController , AlertController} from 'ionic-angular';

import {UserService} from '../../services/user.service';
import {LoginPage} from '../login/login';


@Component({
  templateUrl: 'reglage.html'
})
export class ReglagePage {
  autosend : boolean;
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, private _userService : UserService) {
    this._userService.getState().then(autosend => {
      this.autosend = autosend
    })
  }

  deconnexion(){
  	event.stopPropagation();
   	this.showConfirm();
  }

  
  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Voulez-vous vraiment vous déconnecter, cela supprimera toutes vos fiches ?',
      buttons: [
        {
          text: 'Oui',
          handler: () => {
             this._userService.deleteAll().then(() => this.navCtrl.setRoot(LoginPage));
           }
        },
        {
          text: 'Annuler'
        }
      ]
    });
    confirm.present();
  }

  change(elem){
   switch(elem.checked) {
    case true:
        this._userService.autoSend(true);
        break;
    case false:
        this._userService.autoSend(false);
        break;
   }
  }

}
