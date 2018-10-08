import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { NavParams, AlertController, NavController } from 'ionic-angular';

import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { Fiche } from '../../../data/fiche';
import { FicheService } from '../../../services/fiches';
import { FichePage } from '../fiche';

import { SignatureClient } from '../../signatures/client';
import { SignatureResponsable } from '../../signatures/responsable';


//packages
import * as moment from 'moment';


@Component({
  selector: 'edit',
  templateUrl: 'edit.html'
})
export class EditPage implements OnInit, AfterViewInit {

  signatureClient: SignatureClient;
  signatureResponsable: SignatureResponsable;
  @ViewChild(SignatureClient) set ft(sc: SignatureClient) {
    this.signatureClient = sc;
  }

  @ViewChild(SignatureResponsable) set fo(sr: SignatureResponsable) {
    this.signatureResponsable = sr;
  }


  fiche: Fiche;
  ficheForm: FormGroup;
  user: any;
  id: number;
  msgErreur: string;
  fournituresArray: Array<FormGroup> = [];
  fournituresList: Array<string>;
  numberForm: number;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private formBuilder: FormBuilder, public params: NavParams, private _ficheService: FicheService) {
    this.id = this.params.get('id');
  }


  ngOnInit() {
		this.initializeItems();
    this.getFiche(this.id);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.signatureClient.signaturePad.fromDataURL(this.fiche.signatureClient);
      this.signatureResponsable.signaturePad.fromDataURL(this.fiche.signatureResponsable);

    }, 500);

  }
  getFiche(id: number): Promise<void> {
    return this._ficheService.getFiche(id)
      .then(
        fiche => {
          this.fiche = fiche;
          this.constructFourni();
        }
      );
    ;// construit le tableau des fournitures
  }

  constructFourni() { // construit le tableau des fournitures
    for (let fourni of this.fiche.fournitures) {
      this.fournituresArray.push(
        this.formBuilder.group({
          nom: fourni.nom,
          quantite: fourni.quantite
        })
      );
    }
    this.initForm(); // une fois qu'on a fait le tableau on init le form


  }


  initForm() {
    this.ficheForm = this.formBuilder.group({
      arrive: [this.fiche.arrive, Validators.required],
      depart: [this.fiche.depart],
      temps: [this.fiche.temps],
      positionRoue: [this.fiche.positionRoue, Validators.required],
      nomClient: [this.fiche.nomClient, Validators.required],
      nomAdresse: [this.fiche.nomAdresse],
      dimension: [this.fiche.dimension],
      dimensionLibre: [this.fiche.dimensionLibre],
      nvh: [this.fiche.nvh],
      kmCompteur: [this.fiche.kmCompteur],
      demontage: [this.fiche.demontage],
      depose: [this.fiche.depose],
      reparation: [this.fiche.reparation],
      chaair: [this.fiche.chaair],
      retaillage: [this.fiche.retaillage],
      emplatre: this.formBuilder.group({ // <-- the child FormGroup
        nom: this.fiche.emplatre.nom,
        quantite: this.fiche.emplatre.quantite
      }),
      forfait: [this.fiche.forfait],
      fournitures: this.formBuilder.array(this.fournituresArray),
      observation: [this.fiche.observation],
      numeroPneu: [this.fiche.numeroPneu],
      pression: [this.fiche.pression],
      serrage: [this.fiche.serrage]
    });
  }


  calculTime(): void {
    if (this.ficheForm.get('depart') && this.ficheForm.get('arrive')) {
      let arrive = this.ficheForm.get('arrive').value;
      let depart = this.ficheForm.get('depart').value;
      depart = moment(depart, 'HH:mm');
      arrive = moment(arrive, 'HH:mm');
      let diff = moment.utc(depart.diff(arrive));
      let heures : any = diff.hours();
      let minutes : any = diff.minutes();
      heures = heures ? heures+'h' : '';
      minutes = this.formatTempsPasse(minutes, 'm');

      let format : string = heures + minutes;
      this.ficheForm.controls['temps'].setValue(format);

    }
  }
	formatTempsPasse(dataTime : number, initial : string){
	  let unit : any = dataTime;
	  if(unit ===0){
		unit = '';
	  }else if (unit > 0 && unit < 10){
		unit = '0'+unit+initial;
	  }else{
		unit = unit+initial;
	  }
	  return unit;
	}

  submit(): void {
    this.ficheForm.value.signatureClient = this.signatureClient.getSignature(); // 
    this.ficheForm.value.signatureResponsable = this.signatureResponsable.getSignature(); // 
    this._ficheService.edit(this.id, this.ficheForm.value, )
      .then(() => {
        this.navCtrl.setRoot(FichePage);
      });
  }


  addFourniture() {
    const control = <FormArray>this.ficheForm.controls['fournitures'];
    control.push(this.createItem());
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      nom: '',
      quantite: '1'
    });
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
