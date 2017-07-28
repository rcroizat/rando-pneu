import { Component, ViewChild  } from '@angular/core';
import { NavController } from 'ionic-angular';


import {Validators, FormBuilder, FormGroup} from '@angular/forms';


import { FicheService } from '../../services/fiches';
import { UserService } from '../../services/user.service';

import { FichePage } from '../fiche/fiche';

import { SignatureClient } from './signatures/client';
import { SignatureResponsable } from './signatures/responsable';


@Component({
  selector: 'nouvelle-fiche',
  templateUrl: 'nouvelle-fiche.html'
})
export class NouvelleFichePage {

  @ViewChild(SignatureClient) signatureClient: SignatureClient;
  @ViewChild(SignatureResponsable) signatureResponsable: SignatureResponsable;



	user : any;
	msgErreur : string;
	ficheForm : FormGroup;
 	fiche : any;
 	autosend : boolean;

	constructor( private formBuilder: FormBuilder,  private _ficheService: FicheService, private _userService: UserService, public nav: NavController) {
	  this.ficheForm = this.formBuilder.group({
	      arrive: ['', Validators.required],
	      depart: [''],
	      duree: [''],
	      temps: [''],
	      positionRoue: [''],
	      chiffrage: [''],
	      nomClient: ['', Validators.required],
	      nomAdresse: [''],
	      dimension: [''],
	      nvh: [''],
	      kmCompteur: [''],
	      demontage: [''],
	      depose: [''],
	      reparation: [''],
	      chaair: [''],
	      retaillage: [''],
	      emplatre: [''],
	      valve: [''],
	      forfait: [''],
	      fourniture: [''],
	      observation: [''],
	      numeroPneu: [''],
	      pression: [''],
	      serrage: ['']
    	});
	  this._userService.getState().then(autosend => this.autosend = autosend);
	}



	save() : void{
		let signatureClient = this.signatureClient.getSignature(); // recupere les coordoonnees
		let signatureResponsable = this.signatureResponsable.getSignature();
		this._ficheService.create(this.ficheForm.value, signatureResponsable, signatureClient, (value)  => {
			if(value){
			   this.callback();		
			}
		});
	}

	callback(){
		  this.nav.setRoot(FichePage)
	}



}
