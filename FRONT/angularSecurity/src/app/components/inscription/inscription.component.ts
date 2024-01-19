;
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConnexionService } from '../../services/connexion.service';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/User';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-inscription',
	templateUrl: './inscription.component.html',
	styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit, OnDestroy {
	private _subMessage !: Subscription;
	message?: String;


	constructor(private _connexionService: ConnexionService) {
	}


	onSubmitConnect(form: NgForm) {

		if (form.valid) {
			const user = new User(form.value.lastname, form.value.firstname, form.value.password, form.value.email);
			this._connexionService.createUser(user);
		} else {
			this.message = "information(s) d'inscription invalide(s)";
		}
	}

	ngOnInit() {

		this._connexionService.goToInscription();

		this._subMessage = this._connexionService.message$.subscribe(
			mes => {
				this.message = mes;
			}
		);
	}


	ngOnDestroy(): void {
		this._subMessage.unsubscribe();
	}
}
