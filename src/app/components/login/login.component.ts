import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent{
  userMail: string = "";
  userPWD: string = "";

  loggedUser: string = "";

  constructor(public auth: Auth, private router: Router) {
  }

  Login() {
    signInWithEmailAndPassword(this.auth, this.userMail, this.userPWD).then((res) => {
      if (res.user.email !== null) this.loggedUser = res.user.email;
      this.router.navigate(['home']);
    }).catch((e) => console.log(e))
  }
}
