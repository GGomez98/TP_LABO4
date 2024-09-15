import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { collection, Firestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { addDoc } from '@firebase/firestore';
import {SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, SweetAlert2Module, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  userMail: string = "";
  userPWD: string = "";
  loggedUser: string = "";

  constructor(public auth: Auth, private router: Router, private firestore: Firestore) {
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

  Login() {
    signInWithEmailAndPassword(this.auth, this.userMail, this.userPWD).then((res) => {
      if (res.user.email !== null) 
        this.loggedUser = res.user.email;
        let col = collection(this.firestore, "logins");
        addDoc(col,{fecha: new Date(), "user": this.loggedUser});
        Swal.fire({
        title: `Bienvenido ${res.user.displayName}\nFecha de ingreso: ${this.obtenerFechaActual()}`,
        background: '#000',
        color: '#fff',
        confirmButtonColor: '#ff5722'
        })
      this.router.navigate(['home']);
    }).catch((e) => 
      console.log(e)
    )
  }

  CompletarInputs(mail:string,pass:string) {
    this.userMail=mail;
    this.userPWD=pass;
  }
}
