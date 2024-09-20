import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { AppComponent } from '../../app.component';
import { addDoc, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterOutlet, SweetAlert2Module],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent extends AppComponent{
  newUserMail: string = "";
  newUserPWD: string = "";
  newUserName: string = '';

  loggedUser: string = "";
  flagError: boolean = false;
  msjError: string = "";
  fechaRegistro:string = '';

  Register() {
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      background: '#000',
      color: '#fff', // Evita que se cierre al hacer clic fuera
      didOpen: () => {
        Swal.showLoading(); // Muestra la animación de carga
      }
    });
    createUserWithEmailAndPassword(this.auth, this.newUserMail, this.newUserPWD).then((res) => {
      Swal.close();
      if (res.user.email !== null) 
        this.loggedUser = res.user.email;
        this.fechaRegistro = this.obtenerFechaActual();
        updateProfile(res.user, {
          displayName: this.newUserName,
        });
        let col = collection(this.firestore, "logins");
        addDoc(col,{fecha: new Date(), "user": this.loggedUser});
      Swal.fire({
        title: `Se registro correctamente a ${res.user.displayName}\nFecha de registro: ${this.fechaRegistro}`,
        background: '#000',
        color: '#fff',
        confirmButtonColor: '#ff5722'
        })
      this.router.navigate(['home']);

      this.flagError = false;

    }).catch((e) => {
      Swal.close();
      this.flagError = true;

      switch (e.code) {
        case "auth/invalid-email":
          if(this.newUserMail==''){
            this.msjError = 'Por favor ingrese un mail'
          }
          else{
            this.msjError = 'El mail ingresado es invalido'
          }
          break;
        case "auth/email-already-in-use":
          this.msjError = "Email ya en uso";
          break;
        case "auth/weak-password":
          this.msjError = "La contraseña debe contener como minimo 6 caracteres";
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
}
