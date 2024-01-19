import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/root/app.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { ListusersComponent } from './components/listusers/listusers.component';
import { ProfiluserComponent } from './components/profiluser/profiluser.component';
@NgModule({
  declarations: [
    AppComponent,
    InscriptionComponent,
    ConnexionComponent,
    ListusersComponent,
    ProfiluserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  //  HttpClientXsrfModule.withOptions({
  ///    cookieName: 'XSRF-TOKEN',
   //   headerName: 'X-XSRF-TOKEN', // Nom de l'en-tête où envoyer le jeton CSRF
  //  }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
