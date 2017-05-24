import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Fiche } from '../data/fiche';
import { Storage } from '@ionic/storage';




@Injectable()
export class FicheService {
private url = 'http://www.rando-pneus.fr/api/mail.php';  // URL to web api
private headers = new Headers({'Content-Type': 'application/json'});

fiche : any;
user  : any;
  constructor(public storage : Storage, public http: Http) {
    this.fiche = [];
     this.storage.get('user').then((user) => {
      this.user = user;
     });
     ;
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  
  getFiches() {
       let arr  = [];
      return this.storage.forEach((value, key, index) => {
        if(key.indexOf('fiche') == 0){
          arr.push(value);
        }
      }).then(() =>  arr);
};


  getFiche(id:number){ 
    return this.storage.get('fiche'+id).then(
       (val) => val
       ).catch(this.handleError);
  }

  sendFiche(fiche: Fiche) { 

    let ficheClean : any= fiche;
    ficheClean.nom = 'kaka';
    ficheClean.prenom = this.user.prenom;
    console.log(ficheClean)
      return this.http
      .post(this.url, JSON.stringify(ficheClean), {headers: this.headers})
      .toPromise()
      .then(res => res)
      .catch(this.handleError);


     
  }
  

  create(fiche: Fiche, signatureResponsable : string,  signatureClient : string,  callback ) {

    this.storage.ready().then(() => {
     
     this.storage.get('i').then(val => {
       let i : number = val+1;
       fiche.id = i;
       fiche.signatureResponsable = signatureResponsable;
       fiche.signatureClient = signatureClient;
       this.storage.set('fiche'+i, fiche)
       this.storage.set('i', i);
       callback(true);
       })
     .catch(this.handleError);
    });

      
  }


    edit(id: number, fiche:Fiche) {
      fiche.id = id;
    return this.storage.set('fiche'+id, fiche);
  } 

   delete(id: number) {
    return this.storage.remove('fiche'+id);
    }


}
