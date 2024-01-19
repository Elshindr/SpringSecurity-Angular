import { Router } from '@angular/router';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { ConnexionService } from 'src/app/services/connexion.service';
import { Form, NgForm } from '@angular/forms';

@Component({
  selector: 'app-listusers',
  templateUrl: './listusers.component.html',
  styleUrls: ['./listusers.component.scss']
})
export class ListusersComponent implements OnInit, OnDestroy{

  private subLstUsers !: Subscription;
  lstUsers !: User[];
  lstRoles = ["ADMIN", "MODERATEUR", "USER"];

  constructor(private _svcConnexion: ConnexionService, private _router :Router){
  }


  onRemove(id : number){
    this._svcConnexion.deleteProfil(id);
  }

  onSubmitUpdate(form: NgForm){
    console.log("form submit")
    console.log(form);
    console.log(form.value.id);
    console.log(form.value.role);
    this._svcConnexion.updateProfil(form.value.roles);

  }
  

  ngOnInit(): void {
    console.log("=============== INIT ALL PROFIL ==================");


    if (this._svcConnexion.authIsOk()){

      this._svcConnexion.getAllProfils();

      this.subLstUsers = this._svcConnexion.lstUsers$.subscribe(
        (lstUsers : User[]) => {
          this.lstUsers = lstUsers;
        }
      )

    } else{
      this._router.navigateByUrl("/connexion/connexion");
    }
  }


  ngOnDestroy(): void {
    if(this.subLstUsers != undefined){
      this.subLstUsers.unsubscribe();
    }
  }
}



