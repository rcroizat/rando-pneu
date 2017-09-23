import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Fiche } from '../data/fiche';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController } from 'ionic-angular';

import 'rxjs/Rx';


@Injectable()
export class FicheService {
  private url = 'http://www.rando-pneus.fr/api/mail.php';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  fiche: any;
  user: any;
  constructor(private loadingController: LoadingController, public storage: Storage, public http: Http, public alertCtrl: AlertController) {
    this.fiche = [];
    this.storage.get('user').then((user) => {
      this.user = user;
    });
    ;
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

  sendFicheOld(fiche: Fiche) {

    let ficheClean: any = fiche;
    ficheClean.nom = 'kaka';
    ficheClean.prenom = this.user.prenom;
    return this.http
      .post(this.url, JSON.stringify(ficheClean), { headers: this.headers })
      .toPromise()
      .then(res => res)
      .catch(this.handleError);


  }
  
  sendFiche(fiche: Fiche) {
    let ficheClean: any = fiche;
    ficheClean.nom = this.user.nom ;
    ficheClean.prenom = this.user.prenom || 'prenom';


    /******************************* */
    /******************************* */
    /************A RETIRER********** */
    /******************************* */
    /******************************* */
    ficheClean.signatureClient = 0;
    ficheClean.signatureResponsable = 0;


    /************************/ 
    return this.http
      .post(this.url, JSON.stringify(ficheClean), { headers: this.headers })
      .subscribe(
      res => {
        if (res) {
          let alert = this.alertCtrl.create({
            title: 'Demande envoyée !',
            subTitle: 'Votre fiche a bien été envoyée.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  // this.nav.setRoot(MensualitesPage);
                  console.log('heandler ok' + ficheClean);
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

  create(fiche: Fiche, signatureResponsable: string, signatureClient: string, callback) {

    this.storage.ready().then(() => {

      this.storage.get('i').then(val => {
        let i: number = val + 1;
        fiche.id = i;
        fiche.signatureResponsable = signatureResponsable;
        fiche.signatureClient = signatureClient;
        fiche.aEnvoyer = false;
        fiche.envoye = false;
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
