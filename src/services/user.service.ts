import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Headers, Http } from '@angular/http';/*
import { User } from '../data/user';*/
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';



@Injectable()
export class UserService {
private url = 'http://www.rando-pneus.fr/api/login.php';  // URL to web api
private headers = new Headers({'Content-Type': 'application/json'});
  constructor(public storage: Storage, public http: Http) {

  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  

  login(user : any) {
    if (user.login === null || user.password === null) {
      return null;
    } else {
      return this.http
      .post(this.url, JSON.stringify(user), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
      };
  }  

  storUser(user:any){
   this.storage.set('user', user);
  }


  deleteAll() {
   return this.storage.clear();
  }

  autoSend(state : boolean){
      this.storage.set('autoSend', state);
  }
  getState(){
    return  this.storage.get('autoSend');
  }
}
