import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { ProfiluserComponent } from './components/profiluser/profiluser.component';
import { ListusersComponent } from './components/listusers/listusers.component';

const routes: Routes = [
  { path:'connexion/inscription', component:InscriptionComponent },
  { path:'connexion/connexion', component:ConnexionComponent },
  { path: 'profil', component:ProfiluserComponent },
  { path: 'profil/all', component:ListusersComponent },
  { path: '', redirectTo: 'connexion/inscription', pathMatch: 'full' },
  { path: '**', redirectTo: 'connexion/inscription' },
];



@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
