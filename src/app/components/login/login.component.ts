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
  flagError: boolean = false;
  msjError: string = "";

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
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      background: '#000',
      color: '#fff',
      didOpen: () => {
        Swal.showLoading();
      }
    });
    signInWithEmailAndPassword(this.auth, this.userMail, this.userPWD).then((res) => {
      Swal.close();
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
      this.flagError = false;
    }).catch((e) => {
      Swal.close();
      this.flagError = true;

      console.log(e.code);
      switch (e.code) {
        case "auth/invalid-email":
          if(this.userMail==''){
            this.msjError = 'Por favor ingrese un mail'
          }
          else{
            this.msjError = 'El mail ingresado es invalido'
          }
          break;
        case "auth/invalid-credential":
          this.msjError = "Contraseña incorrecta";
          break;
        case "auth/missing-password":
          this.msjError = "Falta ingresar la contraseña";
          break;
        default:
          this.msjError = "Ocurrio un error inesperado"
          break;
      }

      Swal.fire({
        title: `${this.msjError}`,
        background: '#000',
        color: '#fff',
        confirmButtonColor: '#ff5722'
        })
    });
  }

  CompletarInputs(mail:string,pass:string) {
    this.userMail=mail;
    this.userPWD=pass;
  }
}
