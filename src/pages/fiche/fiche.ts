import { Component , OnInit} from '@angular/core';

import { NavController } from 'ionic-angular';

import { Fiche } from '../../data/fiche';
import { FicheService } from '../../services/fiches';
import { DetailPage } from './detail/detail';
import { EditPage } from './edit/edit';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'fiche',
  templateUrl: 'fiche.html'
})
export class FichePage  implements OnInit {
  fiches:Fiche[];
  user : any;
  constructor(public alertCtrl: AlertController, public navCtrl: NavController,
               private _ficheService: FicheService) {

  }

  getFiches(): void {
      this._ficheService.getFiches().then(fiches => this.fiches = fiches );
   }


  ngOnInit(): void {
     this.getFiches();
  }


  detailPage(id : number): void {
    this.navCtrl.push(DetailPage, {id : id});
  }


  delete(event: Event, id : number): void {
   event.stopPropagation();
   this.showConfirm(id);
  }

  edit(event: Event, id:number): void {
   event.stopPropagation();
   this.navCtrl.push(EditPage, {id:id});
  }

  send(event: Event, fiche:Fiche): void {
   event.stopPropagation();
   this._ficheService.sendFiche(fiche);
  }

/*

     this._ficheService.delete(this.user.id, id).then(() => this.showAlert());*/
  showConfirm(id : number) {
    let confirm = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Voulez-vous vraiment supprimer cette fiche ?',
      buttons: [
        {
          text: 'Oui',
          handler: () => {
             this._ficheService.delete(id).then(() => this.removeItem(id));
           }
        },
        {
          text: 'Annuler',
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }


  removeItem(id : number){
    for(let i = 0; i <  this.fiches.length; i++) {
      if(this.fiches[i].id == id){
        this.fiches.splice(i, 1);
      }
    }
  }
}
