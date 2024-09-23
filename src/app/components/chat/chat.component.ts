import { Component, ElementRef, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, Firestore, getDocs} from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  mensaje='';
  loggedUser: any;
  mensajes: any[] = [];
  mensajesCargados = false;
  @ViewChild('scrollDiv') scrollDiv!: ElementRef;
  @ViewChild('input') input!: ElementRef;

  constructor(public auth: Auth, private firestore: Firestore) {
  }

  ngOnInit(): void {
    this.obtenerMensajes();
  }

  enviarMensaje(){
    if(this.mensaje!=''){
      let col = collection(this.firestore, "mensajes");
      addDoc(col,{fecha: new Date(), "user": this.auth.currentUser?.displayName, "descripcion": this.mensaje});
      this.mensajes = [];
      this.obtenerMensajes()
      console.log(this.mensaje);
      this.mensaje = '';
    }
    else{
      console.log("Por favor ingrese un mensaje");
    }
  }

  async obtenerMensajes(){
    const querySnapshot = await getDocs(collection(this.firestore, "mensajes"));
    querySnapshot.forEach((doc) => {
      this.mensajes.push(doc.data());
    });
    this.mensajes = this.mensajes.sort((a,b)=> a['fecha'] - b['fecha']);
    this.mensajes.forEach(mensaje => {
      const fecha = mensaje['fecha'].toDate();
      const fechaFormateada = fecha.toLocaleString();
      mensaje['fecha'] = fechaFormateada;
    });
    console.log(this.mensajes);
    this.input.nativeElement.hidden = false;
    this.scrollToBottom();
    this.mensajesCargados = true
  }

  scrollToBottom() {
    setTimeout(() => {
      this.scrollDiv.nativeElement.scrollTop = this.scrollDiv.nativeElement.scrollHeight;
    }, 0);
  }
}
