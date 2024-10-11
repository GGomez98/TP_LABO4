import { Component, ElementRef, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, Firestore, getDocs, onSnapshot} from '@angular/fire/firestore';
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
  mensajesExistentes: any[] = [];
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
      this.mensajesExistentes = this.mensajes;
      let col = collection(this.firestore, "mensajes");
      addDoc(col,{id: this.mensajesExistentes.length+1 ,fecha: new Date(), "user": this.auth.currentUser?.displayName, "descripcion": this.mensaje});
      this.obtenerMensajes()
      console.log(this.mensaje);
      this.mensaje = '';
    }
    else{
      console.log("Por favor ingrese un mensaje");
    }
  }

  async obtenerMensajes(){
    const query = collection(this.firestore, "mensajes");

    onSnapshot(query, (querySnapshot) => {
      this.mensajes = [];
      
      // Recorrer los documentos en el snapshot
      querySnapshot.forEach((doc) => {
        const mensaje = doc.data();
        mensaje['fecha'] = mensaje['fecha'].toDate().toLocaleString(); // Formatear la fecha
        this.mensajes.push(mensaje);
      });
  
      // Ordenar los mensajes por fecha
      this.mensajes = this.mensajes.sort((a, b) => a['id'] - b['id']);
      
      // Mostrar los mensajes en consola
      console.log(this.mensajes);
  
      // Desocultar el input y hacer scroll al final
      this.input.nativeElement.hidden = false;
      this.scrollToBottom();
      this.mensajesCargados = true;
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      this.scrollDiv.nativeElement.scrollTop = this.scrollDiv.nativeElement.scrollHeight;
    }, 0);
  }
}
