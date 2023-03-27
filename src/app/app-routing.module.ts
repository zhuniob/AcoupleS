import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './auth-guard.guard';
import { DevelopersOfSystemComponent } from './developers/developers-of-system/developers-of-system.component';
import { ListUserAccountComponent } from './modules/admin/list-user-account/list-user-account.component';
import { ListUsersComponent } from './modules/admin/list-users/list-users.component';
import { RegisterRazaAnimalComponent } from './modules/admin/register-raza-animal/register-raza-animal.component';
import { RegisterTipoAnimalComponent } from './modules/admin/register-tipo-animal/register-tipo-animal.component';

import { HomeComponent } from './modules/hybrid/home/home.component';
import { WelcomeComponent } from './modules/hybrid/welcome/welcome.component';
import { LoginComponent } from './modules/oauth/login/login.component';
import { RecoverAndEnabledAccountComponent } from './modules/oauth/recover-and-enabled-account/recover-and-enabled-account.component';
import { RegisterComponent } from './modules/oauth/register/register.component';
import { GaleryAnimalAllComponent } from './modules/user/animal/galery-animal-all/galery-animal-all.component';
import { ProfileAnimalComponent } from './modules/user/animal/profile-animal/profile-animal.component';
import { ViewAnimalComponent } from './modules/user/animal/view-animal/view-animal.component';
import { ChatComponent } from './modules/user/chat/chat.component';
import { ProfileUserPublicComponent } from './modules/user/profile/profile-user-public/profile-user-public.component';
import { ProfileUserComponent } from './modules/user/profile/profile-user/profile-user.component';
import { RegisterAnimalComponent } from './modules/user/register-animal/register-animal.component';
import { SolicitudComponent } from './modules/user/solicitud/solicitud.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register-user', component: RegisterComponent },

  //No tocar
  // { path: 'register-animal', component: RegisterAnimalComponent, canActivate: [AuthGuardGuard], data: {expectedRoles: 'USUARIO'} },

  { path: 'welcome', component: HomeComponent },
  { path: 'home', component: WelcomeComponent, canActivate: [AuthGuardGuard], data: {expectedRoles: ['ADMIN', 'USUARIO'] }},
  { path: 'register-animal', component: RegisterAnimalComponent, canActivate: [AuthGuardGuard], data: {expectedRoles: 'USUARIO'}},

  { path: 'register-tipo-animal', component: RegisterTipoAnimalComponent, canActivate: [AuthGuardGuard], data: {expectedRoles: 'ADMIN'}},
  { path: 'register-raza-animal', component: RegisterRazaAnimalComponent, canActivate: [AuthGuardGuard], data: {expectedRoles: 'ADMIN'} },
  { path: 'usuario/perfil', component: ProfileUserComponent, canActivate: [AuthGuardGuard], data: {expectedRoles: 'USUARIO'}},
  { path: 'catalogo/animales', component: ViewAnimalComponent, canActivate: [AuthGuardGuard], data: {expectedRoles: 'USUARIO'}},
  { path: 'list/users', component: ListUsersComponent, canActivate: [AuthGuardGuard], data: {expectedRoles: 'ADMIN'} },
  { path: 'admin/list/users/activate', component: ListUserAccountComponent, canActivate: [AuthGuardGuard], data: {expectedRoles: 'ADMIN'} },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuardGuard], data: {expectedRoles: ['ADMIN', 'USUARIO'] }},
  { path: 'chat/:id', component: ChatComponent , canActivate: [AuthGuardGuard], data: {expectedRoles: ['ADMIN', 'USUARIO'] }},
  { path: 'usuario/perfil/animal/:id', component: ProfileAnimalComponent},
  { path: 'solicitud', component: SolicitudComponent, canActivate: [AuthGuardGuard], data: {expectedRoles: 'USUARIO'}},

  { path: 'sistemAnimalscouple/recoverandenabled/account', component: RecoverAndEnabledAccountComponent},
  { path: 'sistemAnimalscouple/galerys/animal', component: GaleryAnimalAllComponent, canActivate: [AuthGuardGuard], data: {expectedRoles: 'USUARIO'}},
  { path: 'usuario/profileuser/profile/:id', component: ProfileUserPublicComponent, canActivate: [AuthGuardGuard], data: {expectedRoles: ['ADMIN', 'USUARIO'] }},
  { path: 'usuario/editanimal/informacion/:id', component: RegisterAnimalComponent, canActivate: [AuthGuardGuard], data: {expectedRoles: ['USUARIO'] }},
  { path: 'developers', component: DevelopersOfSystemComponent},
  { path: '**', pathMatch: 'full', redirectTo: 'welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
