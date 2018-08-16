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
		  'C24 Dépose / Repose PL',
		  'C29 Retaillage',
		  'C30 Equilibrage petit PL',
		  'C31 Equilibre grand PL',
		  'C40 Heure d’attente',
		  'G200 Rallonge 1197',
		  'G201 Rallonge 382405 (Blanche rigide CTTE)',
		  'G205 Rallonge R210 (souple)',
		  'G209 Rallonge coudee W353',
		  'G210 Rallonge V615 (rigide)',
		  'G281 Gonflage mousse polyurethane (kg)',
      'G290 Litre produit anti-crevaison',
      'Produit anti-crevaison',
      'Jante neuve 385/65 X 22.5 Deport 0',
      'Jante neuve 385/65 X 22.5 Deport 120',
      'Jante neuve 315/80 X 22.5',
      'Jante neuve 315/70 X 22.5',
		  'G296 Jante neuve 445/45 X 19.5(REF 6.00 X 19.5',
		  'G297 Jante neuve 215/75 X 17.5 (REF 6.00 X 17.5)',
		  'G298 Jante neuve 385/65 X 22.5 (REF 400 X 22.5)',
		  'G299 Jante neuve 235/245/ 75 X 17.5 (REF 6.75 X 17.5)',
		  'Jante neuve 445/65 X 22.5 (REF1400 X 22.5)',
		  'Jante neuve 13 X 22.5 - 315/80 X 22.5 (REF 9.00)',
		  'Jante neuve 12 X 22.5 (8.25 x 22.5)',
		  'G310 Jante neuve 11 X 22.5 (7.50 x 22.5)',
		  'G350 Joint tyran',
		  'G353 Joint cornifere REF 1528',
		  'G355 Joint sulla REF.1437 OR 325',
		  'G356 Joint heupo REF . 1438 OR225',
		  'G360 Flap 200-20',
		  'V401 CH. 145/155 X 12 - 5/70 X12',
		  'Chambre à air 11.5/80 X 15.3',
		  'Chambre à air 15.5/80 X 24',
		  'Chambre à air 12.5 X 18',
		  'Chambre à air 405/70 X 20',
		  'Chambre à air 5/70 X 12',
		  'Chambre à air 28.9 X 15',
		  'Chambre à air 23.1 X 26',
		  'Chambre à air 10 X 16.5',
		  'Chambre à air 11.5/80 X 15.3',
		  'V412 Chambre à air 205/6.50/700 X 16',
		  'Chambre à air 12 X 16.5',
		  'V417 Chambre à air 600 X 9',
		  'Chambre à air 700 X 12',
		  'V422 C. 7.50/8.25 X 15 - 8.15 X 15',
		  'V425 Chambre à air 10.5 X 18',
		  'V426 Chambre à air 12.5/80 X18',
		  'V427 Chambre à air 18 X 19.5',
		  'Chambre à air 12.5 X 20',
		  'Chambre à air 1000 X 20',
		  'V430 Chambre à air 1200 X 20',
		  'V431 Chambre à air 14.5 X 20',
		  'V432 Chambre à air 23/8.50 X 12',
		  'V435 C. 14.9/ 15.5/80 X24 - 400/440/80 X 24',
		  'V438 Chambre à air 600/40 X 22.5',
		  'V443 Chambre à air 16/70 X 20 - 405/70 X20',
		  'G106 Valve Alcoa Jante alu type 70MS07N2 (40)',
		  'G107 Valve TR 413',
		  'G108 Valve TR 414 L',
		  'G109 Valve TR 415',
		  'G127 Valve REF.1294 (445-385-18 X22.5)',
		  'G128 Valve GC',
		  'G130 Vave REF.1486 - REF.1680 (11-12)',
		  'G132 Valve GSW35 AIR&EAU',
		  'G133 Valve 2123 (courtes 13 X 22.5)',
		  'G135 Valve REF. 4441 (445/65X 22.5)',
		  'G136 Valve REF 1151 (445/65X 22.5',
		];
  }

}
