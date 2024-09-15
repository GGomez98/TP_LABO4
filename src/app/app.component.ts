import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RegistroComponent } from './components/registro/registro.component';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, RegistroComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TP_LABO4';
  username = '';

  constructor(protected router: Router, protected auth: Auth, protected firestore: Firestore) {

  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  isLoggedOut(): boolean {
    const currentRoute = this.router.url;
    return currentRoute === '/login' || currentRoute === '/quien-soy' || currentRoute === '/registro'|| currentRoute === '/';
  }

  logout() {
    console.log('Logout successful');
    this.goTo('/login');
  }

  obtenerFechaActual = () => {
    const fecha = new Date();
  
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const año = fecha.getFullYear();
  
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
  
    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
  };
}
