	import { Injectable } from '@angular/core';
	import { HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
	import { environment } from 'src/environments/environment.development';
	import { User } from '../models/User';
	import { Login } from '../models/Login';
	import { Router } from '@angular/router';
	import { BehaviorSubject } from 'rxjs';
	import { CookieService } from 'ngx-cookie-service';
	import { map } from 'rxjs/operators';
	@Injectable({
	providedIn: 'root'
	})
	export class ConnexionService {
		
		private _baseUrl = environment.urlSpringRest;

		public message$ = new BehaviorSubject<String>("");
		public user$  = new BehaviorSubject<User >(new User("", "", "", ""));
		public lstUsers$  = new BehaviorSubject<User[] >([]);
		public cookies : string[]|null = [];


		constructor(private _cookieService: CookieService, private _http: HttpClient, private _router : Router) {}



		public updateProfil(user: User){
			console.log("=== Update User");
			const headers = new HttpHeaders().set('X-XSRF-TOKEN', this._cookieService.get('XSRF-TOKEN'));
			this._http.put<User[]>(this._baseUrl + 'profil/all/'+ user.id, user, {headers, withCredentials:true}).subscribe(
				(lstUser:User[] )=>{
					console.log("OK :::: Update PROFIL");
					console.log(lstUser);
					this.lstUsers$.next(lstUser);
				},
				(error:Object) =>{
					console.log("ERROR :::: Update PROFIL");
					console.log(error);
				}
			)

		}



		public deleteProfil(id : number): void{
			console.log("=============== Delete  PROFIL ==================");
			const headers = new HttpHeaders().set('X-XSRF-TOKEN', this._cookieService.get('XSRF-TOKEN'));
			this._http.delete<User[]>(this._baseUrl + 'profil/all/'+ id, {headers, withCredentials:true}).subscribe(
				(lstUser:User[] )=>{
					console.log("OK :::: Delete PROFIL");
					console.log(lstUser);
					this.lstUsers$.next(lstUser);
				},
				(error:Object) =>{
					console.log("ERROR :::: Delete PROFIL");
					console.log(error);
				}
			)
		}



		public getAllProfils(): void{
			console.log("=============== GET ALL PROFIL ==================");
			const headers = new HttpHeaders().set('X-XSRF-TOKEN', this._cookieService.get('XSRF-TOKEN'));
			this._http.post<User[]>(this._baseUrl + 'profil/all', this.user$.value,  { headers, withCredentials: true }).subscribe(
				(lstUser:User[] )=>{
					console.log("OK :::: GET ALL PROFIL");
					console.log(lstUser);
					this.lstUsers$.next(lstUser);
				},
				(error:Object) =>{
					console.log("ERROR :::: GET ALL PROFIL");
					console.log(error);
				}
			)
		}



		public getProfilInformations() :void{
			console.log("=============== getProfilInformations ==================");
			let params = new HttpParams();

			if (this.user$.value != null) {
				params = params.append('email', this.user$.value.email);
				params = params.append('password', this.user$.value.password);
	

					const headers = new HttpHeaders().set('X-XSRF-TOKEN', this._cookieService.get('XSRF-TOKEN'));

					this._http.post<User>(this._baseUrl + 'profil',  this.user$.value,  { headers, withCredentials: true }).subscribe(
						(response) => {
							this.user$.next(response);

							const authToken = localStorage.getItem('AUTH-TOKEN');
							console.log("STORAGE ::::::::")
							console.log(authToken)
						},
						(error) =>{
							console.log('Réponse de la requête POST INFORMATIONS:', error);
							console.log(error);
						}
					)
			}
		}



		public postLogout()	:void{// Récupèration du jeton XSRF-TOKEN du cookie}
			console.log("=============DECONNEXION===================");
			console.log('Le cookie XSRF-TOKEN existe :',  this._cookieService.check('XSRF-TOKEN'));
			console.log(this._cookieService.get('XSRF-TOKEN'));

			if(!this._cookieService.check('XSRF-TOKEN') && this.user$.value.email == ""){
				console.log("déjà deco");
				return ;
			}

			const headers = new HttpHeaders().set('X-XSRF-TOKEN', this._cookieService.get('XSRF-TOKEN'));

			this._http.post(this._baseUrl + 'logout',  this.user$.value, { headers, withCredentials: true }).subscribe(
				(response) => {
					console.log('Réponse de la requête POST LOGOUT:', response);
					console.log(response);

					this.user$.next(new User("", "", "", ""));
					this._router.navigateByUrl('connexion/connexion');
					
				},
				(error) => {
					console.error('Erreur lors de la requête POST LOGOUT:', error);
					this.message$.next(error);
				}
			);
		}



		public postLogin(login: Login) {

			console.log("================= TEST DE CONNEXION =======================")

				//console.log(this.getCookie('XSRF-TOKEN'))
			const headers = new HttpHeaders().set('X-XSRF-TOKEN', this._cookieService.get('XSRF-TOKEN'));
			this._http.post<User>(this._baseUrl + 'connexion/connexion', login, {headers, withCredentials: true }).subscribe(
				(user) => {
					console.log('Réponse de la requête POST CONNEXION:', user);
					console.log(user);


					if (user.email != null && user.email != undefined) {
						this.user$.next(user);
						this._router.navigateByUrl('profil');
					} 
					//console.log(this.getCookie('XSRF-TOKEN'))


				},
				(error) => {
					console.error('Erreur lors de la requête POST CONNEXION:', error);
					this.message$.next(error);
					//console.log(this.getCookie('XSRF-TOKEN'))
				}
			);

		//console.log(this.getCookie('XSRF-TOKEN'))
		}



		public createUser(newUser: User) :void{

			const headers = new HttpHeaders().set('X-XSRF-TOKEN', this._cookieService.get('XSRF-TOKEN'));

			this._http.post(this._baseUrl + 'connexion/inscription', newUser, { headers, withCredentials: true }).subscribe(
				(response :Object) => {
					this.message$.next(JSON.parse(JSON.stringify(response)).message);
					console.log('Réponse de la requête POST:', response);

					if (this.message$.value === 'OK') {
						this._router.navigateByUrl('connexion/connexion');
					}

				},
				(error: Object) => {
					console.error('Erreur lors de la requête POST:', error);
					this.message$.next(JSON.parse(JSON.stringify(error)).message);
					
				}
			);
			
		}



		public authIsOk() :boolean{
			console.log("::::::::::::::TEST AUTH :::::::::::");
			const header1 = new HttpHeaders().set('AUTH-TOKEN', this._cookieService.get('AUTH-TOKEN')).set('X-XSRF-TOKEN', this._cookieService.get('XSRF-TOKEN'));
			console.log(header1);
			console.log(this._cookieService.get('AUTH-TOKEN'))
			/*
			if(this._cookieService.check('XSRF-TOKEN')){

				const cookiesMap = new Map<string, string>();
				cookiesMap.set("XSRF-TOKEN", this._cookieService.get('XSRF-TOKEN'));
				this.cookiesAll$.next(cookiesMap)
			}
			if(this._cookieService.check('AUTH-TOKEN')){

				const cookiesMap = new Map<string, string>();
				cookiesMap.set("AUTH-TOKEN", this._cookieService.get('AUTH-TOKEN'));
				this.cookiesAll$.next(cookiesMap)
			}*/



			if(this.user$.value.email != "" /*&& this._cookieService.get('AUTH-TOKEN') != ""*/){
				console.log("Co");
				return true;
			}

			console.log("Pas co");

			return false;
		}


		///
		/// CONNEXION // INSCRIPTION
		///


		public goToInscription() :void {
			this._http.get(this._baseUrl + 'connexion/inscription' ).subscribe(
				(response :Object) => {
					//console.log(response)
					const message = JSON.parse(JSON.stringify(response)).message;
					if(message != "Ok"){
						this.message$.next(message);
					}
					
				},
				(error: Object) => {
					this.message$.next( JSON.parse(JSON.stringify(error)).message);
					//console.log(error)
				}
			);
		}
		
		
		public goToConnexion() :void{
			this._http.get(this._baseUrl +'connexion/connexion').subscribe(
				(response:Object) => {

					//console.log(response)
					const message = JSON.parse(JSON.stringify(response)).message;
					if(message != "Ok"){
						this.message$.next(message);
					}
				
					/*
					console.log("================= GO DANS CONNEXION =======================")
					console.log('Le cookie XSRF-TOKEN existe :', this._cookieService.check('XSRF-TOKEN'));
					console.log(this.getCookie('XSRF-TOKEN'))
					/*
					if(this._cookieService.check('XSRF-TOKEN')){

						const cookiesMap = new Map<string, string>();
						cookiesMap.set("XSRF-TOKEN", this._cookieService.get('XSRF-TOKEN'));
						this.cookiesAll$.next(cookiesMap)
					}*/

					//console.log(this._cookieService.get('XSRF-TOKEN'));

				},
				(error :Object) => {
					//console.log('ERROR INIT CONNEXION');
					//console.log(error)
					this.message$.next( JSON.parse(JSON.stringify(error)).message);
				}
			);
		}

}
