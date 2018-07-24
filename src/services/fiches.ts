import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Fiche } from '../data/fiche';
import { Storage } from '@ionic/storage';
import { User} from '../data/user'


import { AlertController, LoadingController, Events } from 'ionic-angular';

import 'rxjs/Rx';


@Injectable()
export class FicheService {
  private url = 'https://www.rando-pneus.fr/api/mail.php';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  fiche: any;
  user: User;
  constructor(public events: Events, public loadingCtrl: LoadingController, public storage: Storage, public http: Http, public alertCtrl: AlertController) {
    this.fiche = [];
    
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }


  getFiches() {
    let arr = [];
    return this.storage.forEach((value, key, index) => {
      if (key.indexOf('fiche') == 0) {
        arr.push(value);
      }
    }).then(() => arr);
  };


  getFiche(id: number) {
    return this.storage.get('fiche' + id).then(
      (val) => val
    ).catch(this.handleError);
  }


  async sendFiche(fiche: Fiche) {
    const loading = this.loadingCtrl.create({
      content: 'Envoi en cours...'
    });

    loading.present();

    let ficheClean: any = fiche;
    const user = await this.storage.get('user');
    // ficheClean.signatureClient = encodeURIComponent(window.btoa(ficheClean.signatureClient));
    // ficheClean.signatureResponsable = encodeURIComponent(window.btoa(ficheClean.signatureResponsable));
    ficheClean.nom = user.nom || "XXX";
    ficheClean.prenom = user.prenom || 'XXX';
    /************************/
    return this.http
      .post(this.url, JSON.stringify(ficheClean), { headers: this.headers })
      .subscribe(
      res => {
        if (res) {
          loading.dismiss(); // fin du loading
          let alert = this.alertCtrl.create({
            title: 'Demande envoyée !',
            subTitle: 'Votre fiche a bien été envoyée.',
            buttons: [
              {
                text: 'OK',
                handler: () => {

                  this.events.publish('ficheEnvoyed');
                }
              }
            ]
          });
          ficheClean.envoye = true; // on maj le champs envoye a true, et on edit la fiche
          ficheClean.Aenvoyer = false; // on maj le champs envoye a true, et on edit la fiche

          this.edit(ficheClean.id, ficheClean);

          alert.present();
        }
      },
      error => {
        loading.dismiss(); // fin du loading
        let alert = this.alertCtrl.create({
          title: 'Erreur',
          subTitle: 'Votre fiche n\'a pas été envoyée, elle sera envoyée lorsque le serveur sera joignable.',
          buttons: ['OK']
        });
        ficheClean.aEnvoyer = true; // on maj le champs Aenvoyer a true, et on edit la fiche
        ficheClean.envoye = false;
        this.edit(ficheClean.id, ficheClean);
        alert.present();
      }
      )


  }

  create(fiche: Fiche, callback) {

    this.storage.ready().then(() => {

      this.storage.get('i').then(val => {
        let i: number = val + 1; // set l'id de la fiche
        fiche.id = i;
        this.storage.set('fiche' + i, fiche)
        this.storage.set('i', i);

        callback(true);
      })
        .catch(this.handleError);
    });


  }


  edit(id: number, fiche: Fiche) {

    fiche.id = id;
    return this.storage.set('fiche' + id, fiche);
  }

  delete(id: number) {
    return this.storage.remove('fiche' + id);
  }


}
