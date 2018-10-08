import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, Events } from 'ionic-angular';


import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';

//services
import { FicheService } from '../../services/fiches';
import { UserService } from '../../services/user.service';

//datas
import { FichePage } from '../fiche/fiche';

//viewChild
import { SignatureClient } from '../signatures/client';
import { SignatureResponsable } from '../signatures/responsable';

//packages
import * as moment from 'moment';

@Component({
	selector: 'nouvelle-fiche',
	templateUrl: 'nouvelle-fiche.html'
})
export class NouvelleFichePage implements OnInit {

	@ViewChild(SignatureClient) signatureClient: SignatureClient;
	@ViewChild(SignatureResponsable) signatureResponsable: SignatureResponsable;



	msgErreur: string;
	ficheForm: FormGroup;
	autosend: boolean;
	fournitures: FormGroup;
	fournituresList: Array<string>;
	numberForm: number;
	constructor(private formBuilder: FormBuilder,
		private _ficheService: FicheService,
		private _userService: UserService,
		public nav: NavController,
		public events: Events) {
		this.ficheForm = this.formBuilder.group({
			arrive: ['', Validators.required],
			depart: [''],
			temps: [''],
			positionRoue: ['', Validators.required],
			nomClient: ['', Validators.required],
			nomAdresse: [''],
			dimension: [''],
			dimensionLibre: [''],
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
			forfait: [''],
			observation: [''],
			numeroPneu: [''],
			pression: [''],
			serrage: [''],
			fournitures: this.formBuilder.array([])
		});

		events.subscribe('ficheEnvoyed', () => { // quand une fiche est envoyée on retourne sur fichePage
			this.nav.setRoot(FichePage);
		});
	}



	ngOnInit() {

		this._userService.getState().then(autosend => {
			this.autosend = autosend;
		}
		);
		this.initializeItems();
	}

	calculTime(): void {
		if (this.ficheForm.get('depart').value !== '' && this.ficheForm.get('arrive').value !== '') {
			let arrive = this.ficheForm.get('arrive').value;
			let depart = this.ficheForm.get('depart').value;
			depart = moment(depart, 'HH:mm');
			arrive = moment(arrive, 'HH:mm');
			let diff = moment.utc(depart.diff(arrive));
			let heures: any = diff.hours();
			let minutes: any = diff.minutes();
			heures = heures ? heures + 'h' : '';
			minutes = this.formatTempsPasse(minutes, 'm');

			let format: string = heures + minutes;
			this.ficheForm.controls['temps'].setValue(format);

		}
	}
	formatTempsPasse(dataTime: number, initial: string) {
		let unit: any = dataTime;
		if (unit === 0) {
			unit = '';
		} else if (unit > 0 && unit < 10) {
			unit = '0' + unit + initial;
		} else {
			unit = unit + initial;
		}
		return unit;
	}

	/* AUTOCOMPLETION FOURNITURES OLD WAY START*/
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
				return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
			});
			this.fournituresList = this.fournituresList.slice(0, 3);
		}
		else {
			this.fournituresList = [];
		};
	}
	/*AUTO COMPLETION FOURNITURE OLD WAY END*/

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

	deleteFourni(i: number) {
		const control = <FormArray>this.ficheForm.controls['fournitures'];
		control.removeAt(i);
	}

	save(): void {
		this.ficheForm.value.signatureClient = this.signatureClient.getSignature(); // recupere les coordoonnees
		this.ficheForm.value.signatureResponsable = this.signatureResponsable.getSignature();
		this.ficheForm.value.aEnvoyer = false;
		this.ficheForm.value.envoye = false;
		this.ficheForm.value.emplatre.nom = this.ficheForm.value.emplatre.nom || 'Emplâtre'; // on met le nom emplatre par default
		this._ficheService.create(this.ficheForm.value, (value) => {
			if (value) {
				this.callback();
			}
		});


	}

	callback() {
		if (this.autosend) {
			this._ficheService.sendFiche(this.ficheForm.value); // fait direct un setroot avec la reception de l event "ficheenvoyed"
		} else {
			this.nav.setRoot(FichePage);
		}
	}



	clear(signature: string) {
		if (signature === 'client') {
			this.signatureClient.signaturePad.clear()
		} else if (signature === 'responsable') {
			this.signatureResponsable.signaturePad.clear()
		}
	}


	initializeItems() {
		this.fournituresList = [
			'Retaillage',
			'Equilibrage petit PL',
			'Equilibrage grand PL',
			'Rallonge 1197',
			'Rallonge R210 (souple)',
			'Rallonge coudee W353',
			'Rallonge V615 (rigide)',
			'Gonflage mousse polyurethane (kg)',
			'Produit anti-crevaison',
			'Jante neuve 385/65 x 22.5 Deport 0',
			'Jante neuve 385/65 x 22.5 Deport 120',
			'Jante neuve 315/80 x 22.5',
			'Jante neuve 315/70 x 22.5',
			'Jante neuve 445/65 x 22.5',
			'Jante neuve 13 x 22.5',
			'Jante neuve 12 x 22.5',
			'Jante neuve 11 x 22.5',
			'Joint tyran',
			'Joint sulla',
			'Joint heupo',
			'Chambre à air 5/70 x 12',
			'Chambre à air 11.5/80 x 15.3',
			'Chambre à air 15.5/80 x 24',
			'Chambre à air 12.5/80 x 18',
			'Chambre à air 405/70 x 20',
			'Chambre à air 28.9 x 15',
			'Chambre à air 23.1 x 26',
			'Chambre à air 10 x 16.5',
			'Chambre à air 205 x 15',
			'Chambre à air 12 x 16.5',
			'Chambre à air 600 x 9',
			'Chambre à air 700 x 12',
			'Chambre à air 10.5/80 x 18',
			'Chambre à air 18 x 19.5',
			'Chambre à air 12.5 x 20',
			'Chambre à air 1000 x 20',
			'Chambre à air 1200 x 20',
			'Chambre à air 14.5 x 20',
			'Chambre à air 600/40 x 22.5',
			'Chambre à air 16/70 x 20',
			'Rustine PN02',
			'Rustine PN03',
			'Rustine PN04',
			'Rustine PN05',
			'Rustine PN06',
			'Valve Alcoa jante alu',
			'Valve TR 413',
			'Valve TR 414 L',
			'Valve TR 415',
			'Valva 1294',
			'Valve GC',
			'Vave 1486',
			'Valve GSW35',
			'Valve 2123',
			'Valve 4441',
			'Valve 1151',
		];
	}

}
