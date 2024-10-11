import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { QuienSoyComponent } from './components/quien-soy/quien-soy.component';
import { RegistroComponent } from './components/registro/registro.component';
import { authGuard } from './auth.guard';
import { ChatComponent } from './components/chat/chat.component';
import { RankingsComponent } from './components/rankings/rankings.component';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomeComponent, canActivate: [authGuard]},
    {path: 'quien-soy', component: QuienSoyComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'rankings', component: RankingsComponent, canActivate: [authGuard]},
    {path:'juegos',
        loadChildren:() => import('./modulos/juegos/juegos.module').then(m=>m.JuegosModule),canActivate: [authGuard]
    },
    {path:'chat', component:ChatComponent,canActivate: [authGuard]}
];
