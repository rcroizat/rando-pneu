import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AccueilPage } from '../accueil/accueil';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginPage {


	loginForm : FormGroup;
	user:any;


	constructor( public navCtrl: NavController, private formBuilder: FormBuilder, private _userService : UserService) {
	  this.loginForm = this.formBuilder.group({
	      login: ['', Validators.required],
	      password: ['', Validators.required]
    	});
	}

	submit() {
	  this._userService.login(this.loginForm.value)
	    .then(user => {
	    	this._userService.storUser(user);
   			this.navCtrl.setRoot(AccueilPage);
	    }).catch(error => alert(error));
	}
}
