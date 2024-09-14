import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TP_LABO4';

  constructor(private router: Router) {

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
}
