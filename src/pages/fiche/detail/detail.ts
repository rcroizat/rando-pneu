import { Component, OnInit } from '@angular/core';

import { NavParams, Events, NavController } from 'ionic-angular';

import { Fiche } from '../../../data/fiche';
import { FicheService } from '../../../services/fiches';

import { FichePage } from '../fiche';



@Component({
  selector: 'detail',
  templateUrl: 'detail.html'
})
export class DetailPage implements OnInit {

  fiche: Fiche;
  user: any;
  id: any;

  constructor(public nav: NavController,
    public params: NavParams,
    private _ficheService: FicheService,
    public events: Events) { // un system d'event emitter pour revenir a la page "fiche" quand la pop est fermée (navcontroller inutilisable sur un service)
    this.id = this.params.get('id');

    events.subscribe('ficheEnvoyed', () => {
      this.nav.setRoot(FichePage);
    });

  }


  ngOnInit(): void {
    this.getFiche(this.id);
  }


  getFiche(id: number) {
    this._ficheService.getFiche(id).then(
      (fiche) =>
        this.fiche = fiche
    );
  }


  send(event: Event, fiche: Fiche): void {
    event.stopPropagation();
    this._ficheService.sendFiche(fiche);

  }


}
