import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Login } from 'src/app/models/Login';
import { ConnexionService } from 'src/app/services/connexion.service';

@Component({
selector: 'app-connexion',
templateUrl: './connexion.component.html',
styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit, OnDestroy{

	private _subMessage !: Subscription;
	message !: String;


	constructor(private _svcConnexion: ConnexionService){
	}


	onSubmitConnect(form: NgForm) {

		if (form.valid) {
		const login = new Login(form.value.password, form.value.email);
			console.log(login);
			this._svcConnexion.postLogin(login);
		} else{
			this.message = "Information(s) de connexion invalide(s)";
		}
	}


	ngOnInit() {

		this._svcConnexion.goToConnexion();
		
		this._subMessage = this._svcConnexion.message$.subscribe(
			mess => {
				this.message = mess;
			}
		);
	}


	ngOnDestroy(): void {
		this._subMessage.unsubscribe();
	}
}
