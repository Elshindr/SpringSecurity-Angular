import { CookieService } from 'ngx-cookie-service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { ConnexionService } from 'src/app/services/connexion.service';


@Component({
  selector: 'app-profiluser',
  templateUrl: './profiluser.component.html',
  styleUrls: ['./profiluser.component.scss']
})
export class ProfiluserComponent implements OnInit, OnDestroy{

  private _subUser !: Subscription;
  private _subMessage !: Subscription;
  message !: String;
  userCur !: User ;

  constructor(private _connexionService: ConnexionService, private _router: Router, private cookieService: CookieService) {
  }

  ngOnInit() {
    console.log("=============== INIT Informations ==================");

    this._subUser = this._connexionService.user$.subscribe(
      (user :User) => {
          this.userCur = user;
      }
    );

    if(this._connexionService.authIsOk() && this.userCur != undefined){

      this._connexionService.getProfilInformations();

    } else {
      console.log("retour vers connexion/connexion")
      this._router.navigateByUrl('connexion/connexion');
    }

    this._subMessage = this._connexionService.message$.subscribe(
      (mess :String) => {
        this.message = mess;
      }
    );



   // console.log("AVANT MON PUTAIN DE GET COOKIEES")
    //const merde = this._connexionService.getCookie('AUTH-TOKEN');
    //console.log(" depuis profil COMPONENT getCookie('AUTH-TOKEN')")
    //console.log(merde);
    
  }


  ngOnDestroy(): void {
    this._subUser.unsubscribe();
    this._subMessage.unsubscribe();
  }
}
