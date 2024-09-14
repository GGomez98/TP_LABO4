import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterOutlet],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent{
  newUserMail: string = "";
  newUserPWD: string = "";

  loggedUser: string = "";
  flagError: boolean = false;
  msjError: string = "";

  constructor(public auth: Auth, private router: Router) {
  }

  Register() {
    createUserWithEmailAndPassword(this.auth, this.newUserMail, this.newUserPWD).then((res) => {
      if (res.user.email !== null) this.loggedUser = res.user.email;
      this.router.navigate(['home']);

      this.flagError = false;

    }).catch((e) => {
      this.flagError = true;

      switch (e.code) {
        case "auth/invalid-email":
          this.msjError = "Email invalido";
          break;
        case "auth/email-already-in-use":
          this.msjError = "Email ya en uso";
          break;
        default:
          this.msjError = e.code
          break;
      }
    });
  }
}
