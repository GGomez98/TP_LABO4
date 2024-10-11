import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, Firestore, limit, onSnapshot, orderBy} from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rankings',
  standalone: true,
  imports: [FormsModule,RouterLink, CommonModule],
  templateUrl: './rankings.component.html',
  styleUrl: './rankings.component.scss'
})
export class RankingsComponent {
  jugadoresAhorcado:any[] = [];
  jugadoresMayorMenor:any[] = [];
  jugadoresPreguntas:any[] = [];
  jugadoresSimonDice:any[] = [];
  puntajesCargados: boolean[] = [false,false,false,false];

  constructor(public auth: Auth, private firestore: Firestore) {
  }

  ngOnInit(){
    this.obtenerJugadores('ahorcado');
    this.obtenerJugadores('mayor-o-menor');
    this.obtenerJugadores('preguntas');
    this.obtenerJugadores('simon-dice');
  }

  obtenerJugadores(juego: string){
    let query = collection(this.firestore, juego);
    switch(juego){
      case 'ahorcado':
        onSnapshot(query, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const jugador = doc.data();
            this.jugadoresAhorcado.push(jugador);
            jugador['fecha'] = jugador['fecha'].toDate();
            jugador['fecha'] = String(jugador['fecha'].getDate()).padStart(2,'0') + "/" + String(jugador['fecha'].getMonth()) + "/" + String(jugador['fecha'].getFullYear())
            console.log(jugador);
          });
          this.jugadoresAhorcado.sort((a, b) => b.puntaje - a.puntaje);
          this.jugadoresAhorcado = this.jugadoresAhorcado.slice(0,10);
          this.puntajesCargados[0] = true;
        });
      break;
      case 'mayor-o-menor':
        onSnapshot(query, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const jugador = doc.data();
            this.jugadoresMayorMenor.push(jugador);
            jugador['fecha'] = jugador['fecha'].toDate();
            jugador['fecha'] = String(jugador['fecha'].getDate()).padStart(2,'0') + "/" + String(jugador['fecha'].getMonth()) + "/" + String(jugador['fecha'].getFullYear())
          });
          this.jugadoresMayorMenor.sort((a, b) => b.puntaje - a.puntaje);
          this.jugadoresMayorMenor = this.jugadoresMayorMenor.slice(0,10);
          this.puntajesCargados[1] = true;
        });
      break;
      case 'preguntas':
        onSnapshot(query, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const jugador = doc.data();
            this.jugadoresPreguntas.push(jugador);
            jugador['fecha'] = jugador['fecha'].toDate();
            jugador['fecha'] = String(jugador['fecha'].getDate()).padStart(2,'0') + "/" + String(jugador['fecha'].getMonth()) + "/" + String(jugador['fecha'].getFullYear())
          });
          this.jugadoresPreguntas.sort((a, b) => b.puntaje - a.puntaje);
          this.jugadoresPreguntas = this.jugadoresPreguntas.slice(0,10);
          this.puntajesCargados[2] = true;
        });
      break;
      case 'simon-dice':
        onSnapshot(query, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const jugador = doc.data();
            this.jugadoresSimonDice.push(jugador);
            jugador['fecha'] = jugador['fecha'].toDate();
            jugador['fecha'] = String(jugador['fecha'].getDate()).padStart(2,'0') + "/" + String(jugador['fecha'].getMonth()) + "/" + String(jugador['fecha'].getFullYear())
          });
          this.jugadoresSimonDice.sort((a, b) => b.puntaje - a.puntaje);
          this.jugadoresSimonDice = this.jugadoresSimonDice.slice(0,10);
          this.puntajesCargados[3] = true;
        });
      break;
    }
  }
}
