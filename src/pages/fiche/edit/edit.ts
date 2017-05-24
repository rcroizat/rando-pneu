import { Component , OnInit} from '@angular/core';

import { NavParams, AlertController, NavController } from 'ionic-angular';

import {Validators, FormBuilder, FormGroup} from '@angular/forms';

import { Fiche } from '../../../data/fiche';
import { FicheService } from '../../../services/fiches';
import { FichePage } from '../fiche';

@Component({
  selector: 'edit',
  templateUrl: 'edit.html'
})
export class EditPage  implements OnInit {

  fiche:Fiche;
  ficheForm : FormGroup;
  user:any;
  id:number;
  msgErreur : string;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private formBuilder: FormBuilder, public params: NavParams,  private _ficheService: FicheService) {
      

   this.id = this.params.get('id');
  }


  ngOnInit(): void {

     this.getFiche(this.id);
    
  }

  getFiche(id:number): void {
      this._ficheService.getFiche(id)
                        .then(
                          fiche => {
                            this.fiche = fiche;
                             this.initForm();
                            }
                          );

   }

   initForm(){
      this.ficheForm = this.formBuilder.group({
        arrive: [this.fiche.arrive, Validators.required],
        depart: [this.fiche.depart],
        duree: [this.fiche.duree],
        temps: [this.fiche.temps],
        positionRoue: [this.fiche.positionRoue],
        chiffrage: [this.fiche.chiffrage],
        nomClient: [this.fiche.nomClient, Validators.required],
        nomAdresse: [this.fiche.nomAdresse],
        dimension: [this.fiche.dimension],
        nvh: [this.fiche.nvh],
        kmCompteur: [this.fiche.kmCompteur],
        demontage: [this.fiche.demontage],
        depose: [this.fiche.depose],
        reparation: [this.fiche.reparation],
        chaair: [this.fiche.chaair],
        retaillage: [this.fiche.retaillage],
        emplatre: [this.fiche.emplatre],
        valve: [this.fiche.valve],
        forfait: [this.fiche.forfait],
        fourniture: [this.fiche.fourniture],
        observation: [this.fiche.observation],
        numeroPneu: [this.fiche.numeroPneu],
        pression: [this.fiche.pression],
        serrage: [this.fiche.serrage]
      });
   }
     
  submit() : void{
      this._ficheService.edit(this.id, this.ficheForm.value)
          .then(() => { 
              this.navCtrl.setRoot(FichePage);
          });
  }



}
