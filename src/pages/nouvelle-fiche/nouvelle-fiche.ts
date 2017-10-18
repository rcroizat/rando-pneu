import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';


import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';


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



	user: any;
	msgErreur: string;
	ficheForm: FormGroup;
	fiche: any;
	autosend: boolean;
	fournitures: FormGroup;
	fournituresList: Array<string>;
	numberForm: number;
	constructor(private formBuilder: FormBuilder, private _ficheService: FicheService, private _userService: UserService, public nav: NavController) {
		this.ficheForm = this.formBuilder.group({
			arrive: ['', Validators.required],
			depart: [''],
			duree: [''],
			temps: [''],
			// positionRoue: [''],
			positionRoue: ['', Validators.required],
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
			emplatre: this.formBuilder.group({ // <-- the child FormGroup
				nom: '',
				quantite: ''
			}),
			valve: this.formBuilder.group({ // <-- the child FormGroup
				nom: '',
				quantite: ''
			}),
			forfait: [''],
			observation: [''],
			numeroPneu: [''],
			pression: [''],
			serrage: [''],
			fournitures: this.formBuilder.array([this.createItem()])
		});
		this._userService.getState().then(autosend => this.autosend = autosend);
	}


	initializeItems() {
		this.fournituresList = [
			'C21 Démontage / Remontage PL',
			'C24 Dépose / Repose PL',
			'C26 Réparation à froid',
			'C29 Retaillage',
			'C30 Equilibrage petit PL',
			'C31 Equilibre grand PL',
			'C33 Forfait véhiculé',
			'C40 Heure d’attente',
			'C57 Déplacement astreinte',
			'C61 Gonflage mousse polyurethane (kgs)',
			'G200 Rallonge 1197',
			'G201 Rallonge 382405 (Blanche rigide CTTE)',
			'G205 Rallonge R210 (souple)',
			'G209 Rallonge coudee W353',
			'G210 Rallonge V615 (rigide)',
			'G281 Gonflage mousse polyurethane (kg)',
			'G290 Litre produit anti-crevaison',
			'G296 Jante neuve 445/45 X 19.5(REF 6.00 X 19.5',
			'G297 Jante neuve 215/75 X 17.5 (REF 6.00 X 17.5)',
			'G298 Jante neuve 385/65 X 22.5 (REF 400 X 22.5)',
			'G299 Jante neuve 235/245/ 75 X 17.5 (REF 6.75 X 17.5)',
			'G300 Jante neuve 445/65 X 22.5 (REF1400 X 22.5)',
			'G301 Jante neuve 13 X 22.5 - 315/80 X 22.5 (REF 9.00)',
			'G309 Jante neuve 12 X 22.5 (8.25 x 22.5)',
			'G310 Jante neuve 11 X 22.5 (7.50 x 22.5)',
			'G350 Joint tyran',
			'G353 Joint cornifere REF 1528',
			'G355 Joint sulla REF.1437 OR 325',
			'G356 Joint heuro REF . 1438 OR225',
			'G360 Flap 200-20',
			'V401 CH. 145/155 X 12 - 5/70 X12',
			'V410 Chambre à air 10 X 16.5',
			'V411 Chambre à air 11.5/80 X 15.3',
			'V412 Chambre à air 205/6.50/700 X 16',
			'V413 Chambre à air 12 X 16.5',
			'V417 Chambre à air 600 X 9',
			'V420 Chambre à air 700 X 12',
			'V422 C. 7.50/8.25 X 15 - 8.15 X 15',
			'V425 Chambre à air 10.5 X 18',
			'V426 Chambre à air 12.5/80 X18',
			'V427 Chambre à air 18 X 19.5',
			'V428 Chambre à air 12.5 X 20',
			'V429 Chambre à air 1000 X 20',
			'V430 Chambre à air 1200 X 20',
			'V431 Chambre à air 14.5 X 20',
			'V432 Chambre à air 23/8.50 X 12',
			'V435 C. 14.9/ 15.5/80 X24 - 400/440/80 X 24',
			'V438 Chambre à air 600/40 X 22.5',
			'V443 Chambre à air 16/70 X 20 - 405/70 X20'
		];
	}


	insertInput(fourniture: string, i: number) {
		// insert le résultat de la recherche dans le bon champ
		(<FormGroup>this.ficheForm.controls['fournitures']).controls[i].patchValue({
			nom: fourniture
		});
		this.fournituresList = [];
	};


	getItems(ev: any, i: number) {
		this.numberForm = i;
		// Reset items back to all of the items
		this.initializeItems();

		// set val to the value of the searchbar
		let val = ev.target.value;

		// if the value is an empty string don't filter the items
		if (val && val.trim() != '') {
			this.fournituresList = this.fournituresList.filter((item) => {
				return (item.toLowerCase().indexOf(val.toLowerCase()) > 0);
			});
			this.fournituresList = this.fournituresList.slice(0, 3);
		}
		else {
			this.fournituresList = [];
		};
	}


	createItem(): FormGroup {
		return this.formBuilder.group({
			nom: '',
			quantite: '1'
		});
	}


	addFourniture() {
		const control = <FormArray>this.ficheForm.controls['fournitures'];
		control.push(this.createItem());
	}

	deleteFourni(i : number){
		const control = <FormArray>this.ficheForm.controls['fournitures'];
		control.removeAt(i);
	}

	save(): void {
		let signatureClient = this.signatureClient.getSignature(); // recupere les coordoonnees
		let signatureResponsable = this.signatureResponsable.getSignature();
		this._ficheService.create(this.ficheForm.value, signatureResponsable, signatureClient, (value) => {
			if (value) {
				this.callback();
			}
		});
	}

	callback() {
		this.nav.setRoot(FichePage);
	}



}
