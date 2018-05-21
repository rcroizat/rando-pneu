import { Component, ViewChild  } from '@angular/core';

import { SignaturePad } from 'angular2-signaturepad/signature-pad';



@Component({
  selector: 'signature-responsable',
  template : ' <signature-pad [options]="signaturePadOptions" (onBeginEvent)="drawStart()" (onEndEvent)="drawComplete()"></signature-pad>'
})
export class SignatureResponsable {

  @ViewChild(SignaturePad) signaturePad: SignaturePad;

   private signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 1,
    'maxWidth': 2,
    'canvasWidth': 300,
    'canvasHeight': 200
  };

	constructor( ) {
	  
	}



  private ngAfterViewInit() {
  	// this.signaturePad is now available

  }
 
  private drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
  }
 
  private drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
  }




	getSignature() : string{
		return this.signaturePad.toDataURL();
	}




}
