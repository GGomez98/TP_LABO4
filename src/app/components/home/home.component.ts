import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JuegosModule } from '../../modulos/juegos/juegos.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, FormsModule,JuegosModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent{
  constructor(private router: Router) {

  }

  goTo(path: string) {
    console.log(path);
    this.router.navigate([path]);
  }
}
