import { User } from 'src/app/models/User';
import { ConnexionService } from './../../services/connexion.service';
import { ConnexionComponent } from './../connexion/connexion.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angularSecurity';

  userCur !: User ;
  itemNavAuth : Boolean = false;
  private subConnexion !: Subscription;

  constructor(private _svcConnexion : ConnexionService){

  }
  


  

  reloadConnexion ():void{
    this._svcConnexion.goToConnexion();
  }

  logOut ():void{
    this._svcConnexion.postLogout();
  }

  ngOnInit(): void {

    this.subConnexion = this._svcConnexion.user$.subscribe(
      (user: User) =>{
        this.userCur = user;
      }
    )

    if (this._svcConnexion.authIsOk()) {
      console.log("profil");
      this.itemNavAuth = true;
    } else {
      console.log("connexion");
      this.itemNavAuth = false;
    }
  }

  ngOnDestroy(): void {
    this.subConnexion.unsubscribe();
  }
}
