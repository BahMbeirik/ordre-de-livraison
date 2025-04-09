import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';
import { AuthService } from './services/auth.service';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ProduitListComponent } from './components/produit-list/produit-list.component';
import { ProduitAddComponent } from './components/produit-add/produit-add.component';
import { DepotAddComponent } from './components/depot-add/depot-add.component';
import { DepotListComponent } from './components/depot-list/depot-list.component';
import { DepotEditComponent } from './components/depot-edit/depot-edit.component';
import { DepotDetailsComponent } from './components/depot-details/depot-details.component';
import { ProduitEditComponent } from './components/produit-edit/produit-edit.component';
import { ProduitDetailsComponent } from './components/produit-details/produit-details.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { CommandeFormComponent } from './components/commande-form/commande-form.component';
import { CommandeComponent } from './components/commande/commande.component';
import { FactureComponent } from './components/facture/facture.component';
import { DatePipe } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LivreurNotificationComponent } from './components/livreur-notification/livreur-notification.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserListComponent,
    NavbarAdminComponent,
    WelcomeComponent,
    UnauthorizedComponent,
    ProduitListComponent,
    ProduitAddComponent,
    DepotAddComponent,
    DepotListComponent,
    DepotEditComponent,
    DepotDetailsComponent,
    ProduitEditComponent,
    ProduitDetailsComponent,
    ClientListComponent,
    ClientFormComponent,
    CommandeFormComponent,
    CommandeComponent,
    FactureComponent,
    LivreurNotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [
    // Intercepteur pour ajouter le token JWT aux requêtes
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    AuthService,
    DatePipe
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }