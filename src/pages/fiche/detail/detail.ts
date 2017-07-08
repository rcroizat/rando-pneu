import { Component , OnInit} from '@angular/core';

import { NavParams } from 'ionic-angular';


import { Fiche } from '../../../data/fiche';
import { FicheService } from '../../../services/fiches';

@Component({
  selector: 'detail',
  templateUrl: 'detail.html'
})
export class DetailPage  implements OnInit {

  fiche:Fiche;
  user:any;
  id:any;

  constructor( public params: NavParams,  private _ficheService: FicheService) {
   this.id = this.params.get('id');
  }


  ngOnInit(): void {
     this.getFiche(this.id);
  }

  
  getFiche(id:number){  
    this._ficheService.getFiche(id).then(
       (fiche) => this.fiche = fiche);
   }


  send(event: Event, fiche:Fiche): void {
   event.stopPropagation();
   this._ficheService.sendFiche(fiche);
  }


}
