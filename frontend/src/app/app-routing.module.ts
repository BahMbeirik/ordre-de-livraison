import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { RoleGuard } from './guards/role.guard';
import { AuthGuard } from './guards/auth.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ProduitListComponent } from './components/produit-list/produit-list.component';
import { ProduitAddComponent } from './components/produit-add/produit-add.component';
import { ProduitEditComponent } from './components/produit-edit/produit-edit.component';
import { ProduitDetailsComponent } from './components/produit-details/produit-details.component';
import { DepotListComponent } from './components/depot-list/depot-list.component';
import { DepotAddComponent } from './components/depot-add/depot-add.component';
import { DepotEditComponent } from './components/depot-edit/depot-edit.component';
import { DepotDetailsComponent } from './components/depot-details/depot-details.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { CommandeComponent } from './components/commande/commande.component';
import { CommandeFormComponent } from './components/commande-form/commande-form.component';
import { FactureComponent } from './components/facture/facture.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent},
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ADMIN' } },
  { path: 'clients', component: ClientListComponent , canActivate: [AuthGuard, RoleGuard], data: { role: ['ADMIN','LIVREUR'] }},
  { path: 'clients/new', component: ClientFormComponent , canActivate: [AuthGuard, RoleGuard], data: { role: 'ADMIN' }},
  { path: 'clients/:id/edit', component: ClientFormComponent , canActivate: [AuthGuard, RoleGuard], data: { role: ['ADMIN','LIVREUR'] }},
  { path: 'produits', component: ProduitListComponent , canActivate: [AuthGuard, RoleGuard], data: { role: ['ADMIN','RESPONSABLE','COMERCIAL'] }},
  { path: 'produits/add', component: ProduitAddComponent , canActivate: [AuthGuard, RoleGuard], data: { role: ['ADMIN','RESPONSABLE','COMERCIAL'] }},
  { path: 'produits/edit/:id', component: ProduitEditComponent , canActivate: [AuthGuard, RoleGuard], data: { role: ['ADMIN','RESPONSABLE','COMERCIAL'] }},
  { path: 'produits/:id', component: ProduitDetailsComponent , canActivate: [AuthGuard, RoleGuard], data: { role: ['ADMIN','RESPONSABLE','COMERCIAL'] }},
  { path: 'depots', component: DepotListComponent , canActivate: [AuthGuard, RoleGuard], data: { role: ['ADMIN','COMERCIAL'] }},
  { path: 'depots/add', component: DepotAddComponent , canActivate: [AuthGuard, RoleGuard], data: { role: ['ADMIN', 'COMERCIAL'] }},
  { path: 'depots/edit/:id', component: DepotEditComponent , canActivate: [AuthGuard, RoleGuard], data: { role: ['ADMIN', 'COMERCIAL'] }},
  { path: 'depots/:id', component: DepotDetailsComponent , canActivate: [AuthGuard, RoleGuard], data: { role: ['ADMIN', 'COMERCIAL'] }},
  { path: 'commandes', component: CommandeComponent },
  { path: 'commandes/new', component: CommandeFormComponent },
  { path: 'commandes/edit/:id', component: CommandeFormComponent },
  { path: 'commandes/:id', component: FactureComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: '**', redirectTo: '/welcome' },
];
  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }