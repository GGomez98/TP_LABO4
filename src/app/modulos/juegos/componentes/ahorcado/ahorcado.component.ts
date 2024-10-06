import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ahorcado',
  standalone: false,
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss'
})
export class AhorcadoComponent {
  palabras = ['GATO', 'PERRO', 'CASA', 'FLOR', 'ARBOL', 'LUNA', 'SOL', 'MAR', 'CIELO', 'NUBE',
    'RIO', 'FUEGO', 'AGUA', 'TIERRA', 'AIRE', 'ESTRELLA', 'LIBRO', 'MUSICA', 'CINE',
    'COMIDA', 'BEBIDA', 'JUEGO', 'DEPORTE', 'COCHE', 'AVION', 'BARCO', 'TREN', 'BICICLETA', 'CIUDAD',
    'PAIS', 'MUNDO', 'IDIOMA', 'PALABRA', 'LETRA', 'SONIDO', 'COLOR', 'LINEA', 'CIRCULO', 'CUADRADO',
    'FAMILIA', 'AMIGO', 'AMOR', 'PAZ', 'GUERRA', 'TRABAJO', 'ESCUELA', 'OFICINA', 'PARQUE', 'CALLE',
    'CARRETERA', 'PUENTE', 'MUSEO', 'TEATRO', 'HOSPITAL', 'IGLESIA', 'TEMPLO', 'TIENDA', 'RESTAURANTE', 'CAFETERIA',
    'ZAPATO', 'CAMISETA', 'PANTALON', 'SOMBRERO', 'RELOJ', 'BOLSA', 'LLAVE', 'TELÉFONO', 'ORDENADOR', 'MESA',
    'SILLA', 'CAMA', 'SOFA', 'VENTANA', 'PUERTA', 'LIBRETA', 'LAPIZ', 'BOLIGRAFO', 'CEPILLO', 'ESPEJO',
    'PEINE', 'JABON', 'TOALLA', 'LAVAVAJILLAS', 'NEVERA', 'LAVADORA', 'COCINA', 'HORNO', 'MICROONDAS', 'TELEVISOR',
    'RADIO', 'CAMARA', 'REPRODUCTOR', 'MOTOR', 'BATERIA', 'CARGADOR', 'CUADERNO', 'GRIFO', 'CORTE', 'PLATO'];
  palabraSeleccionada = '';
  palabraOculta = '';
  vidasCount = 5;
  puntos = 0;
  teclado = document.getElementsByClassName('letter');
  ahorcadoImagen = "";

  constructor(private firestore: Firestore, protected auth: Auth) {}

  ngOnInit(): void {
    this.InitGame();
    Swal.fire({
      title: `Ahorcado`,
      html:`<div style="text-align: left;">
      -Tenes 5 intentos para adivinar la palabra secreta<br><br>
      -Cada letra que se agregue vale un punto y cada letra incorrecta resta una vida<br><br>
      -Al acertar una palabra esta se reemplaza por otra y el jugador vuelve a tener todas las vidas<br><br>
      -El juegos se termina cuando te quedas sin vidas
      </div>`,
      background: '#000',
      color: '#fff',
      confirmButtonColor: '#ff5722',
      confirmButtonText:"Entendido",
      allowOutsideClick: false,
      allowEscapeKey: false
    }); 
  }

  InitGame(){
    this.palabraOculta = '';
    this.MostrarImagen();
    this.palabraSeleccionada = this.palabras[Math.floor(Math.random()*(this.palabras.length))]
    console.log(this.palabraSeleccionada);
    for(let i=0; i<this.palabraSeleccionada.length; i++){
      this.palabraOculta+='_';
    }
    console.log(this.teclado)
    for (let i = 0; i < this.teclado.length; i++) {
      let buttonId = this.teclado[i].id;
      let button = document.getElementById(buttonId);
      if(button!=null){
        button.style.display = 'block';
      }
    }
  }

  MostrarImagen(){
    switch(this.vidasCount){
      case 4:
        this.ahorcadoImagen = 'https://firebasestorage.googleapis.com/v0/b/tp-labo4-fae81.appspot.com/o/Ahorcado-4.png?alt=media&token=247646c2-b794-4c65-8037-928242470213'
      break;
      case 3:
        this.ahorcadoImagen = 'https://firebasestorage.googleapis.com/v0/b/tp-labo4-fae81.appspot.com/o/Ahorcado-3.png?alt=media&token=16f8fc5c-f6b9-4380-8dea-d0734ab173fd'
      break;
      case 2:
        this.ahorcadoImagen = 'https://firebasestorage.googleapis.com/v0/b/tp-labo4-fae81.appspot.com/o/Ahorcado-2.png?alt=media&token=5da5fcae-b20d-4410-b85b-33e3cb739745'
      break;
      case 1:
        this.ahorcadoImagen = 'https://firebasestorage.googleapis.com/v0/b/tp-labo4-fae81.appspot.com/o/Ahorcado-1.png?alt=media&token=d88bd817-1f48-4a7c-b3e3-72ff711da40b'
      break;
      case 0:
        this.ahorcadoImagen = 'https://firebasestorage.googleapis.com/v0/b/tp-labo4-fae81.appspot.com/o/Ahorcado-0.png?alt=media&token=8b1c6b4a-2ed6-4696-8ebc-5c62e81a9241'
      break;
      default:
        this.ahorcadoImagen = 'https://firebasestorage.googleapis.com/v0/b/tp-labo4-fae81.appspot.com/o/Ahorcado-5.png?alt=media&token=4c7b47f6-1797-4bbb-b020-1c3290d59407'
      break;
    }
  }

  BuscarLetra(letra:string): void{
    let letrasEncontradas: string[] = [];
    let letraExiste = false;
    for(let i=0; i<this.palabraSeleccionada.length; i++){
      if(letra.toUpperCase() == this.palabraSeleccionada[i].toUpperCase()){
        let arrayPalabraOculta = this.palabraOculta.split("");
        arrayPalabraOculta[i] = letra.toUpperCase();
        this.palabraOculta = arrayPalabraOculta.join("");
        letrasEncontradas.push(letra.toUpperCase());
        letraExiste = true;
        this.puntos++;
      }
    }
    if(!letraExiste){
      console.log("Esa letra no existe");
      this.vidasCount--;
      this.MostrarImagen();
    }
    this.hideButton(letra);
    if(this.ActualizarPalabra()){
      if(this.vidasCount == 0){
        this.palabraOculta = this.palabraSeleccionada;
        this.MostrarImagen();
        for(let i=0; i<this.teclado.length; i++){
          let buttonId = this.teclado[i].id;
          let button = document.getElementById(buttonId);
          if(button!=null && button.style.display == 'block'){
            button.style.display = 'none';
          }
        }
        setTimeout(() => {
          Swal.fire({
            title: `Perdiste\nPuntuacion Final: ${this.puntos}`,
            background: '#000',
            color: '#fff',
            confirmButtonColor: '#ff5722',
            confirmButtonText: "Reiniciar Juego"
            }).then((result) => {
              if (result.isConfirmed) {
                // Aquí puedes ejecutar el método o código que desees al hacer clic en "Confirmar"
                let col = collection(this.firestore, "ahorcado");
                addDoc(col,{puntaje: this.puntos, "user": this.auth.currentUser?.displayName});
                this.vidasCount = 5;
                this.puntos = 0;
                this.InitGame();
              }
            });
        }, 3000);
      }
      else{
        this.palabraOculta = this.palabraSeleccionada;
        for(let i=0; i<this.teclado.length; i++){
          let buttonId = this.teclado[i].id;
          let button = document.getElementById(buttonId);
          if(button!=null && button.style.display == 'block'){
            button.style.display = 'none';
          }
        }
        setTimeout(() => {
          this.palabraOculta = '';
          this.vidasCount = 5;
          this.InitGame();
        }, 1000);
      }
    }
  }

  hideButton(buttonId: string): void {
    const button = document.getElementById(buttonId);
    if (button) {
      button.style.display = 'none'; // Oculta el botón
    }
  }

  get vidas(): number[] {
    return Array(this.vidasCount).fill(0).map((_, index) => index);
  }

  ActualizarPalabra(): boolean{
    let resultado = false;
    if(this.vidasCount == 0 || this.palabraOculta.indexOf('_')==-1){
      resultado = true;
      this.palabraOculta = '';
    }
    return resultado;
  }
}
