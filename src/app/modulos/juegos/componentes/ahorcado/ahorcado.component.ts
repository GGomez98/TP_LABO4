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
    'RÍO', 'FUEGO', 'AGUA', 'TIERRA', 'AIRE', 'ESTRELLA', 'LIBRO', 'MUSICA', 'CINE',
    'COMIDA', 'BEBIDA', 'JUEGO', 'DEPORTE', 'COCHE', 'AVIÓN', 'BARCO', 'TREN', 'BICICLETA', 'CIUDAD',
    'PAÍS', 'MUNDO', 'IDIOMA', 'PALABRA', 'LETRA', 'SONIDO', 'COLOR', 'LINEA', 'CÍRCULO', 'CUADRADO',
    'FAMILIA', 'AMIGO', 'AMOR', 'PAZ', 'GUERRA', 'TRABAJO', 'ESCUELA', 'OFICINA', 'PARQUE', 'CALLE',
    'CARRETERA', 'PUENTE', 'MUSEO', 'TEATRO', 'HOSPITAL', 'IGLESIA', 'TEMPLO', 'TIENDA', 'RESTAURANTE', 'CAFETERÍA',
    'ZAPATO', 'CAMISETA', 'PANTALÓN', 'SOMBRERO', 'RELOJ', 'BOLSA', 'LLAVE', 'TELÉFONO', 'ORDENADOR', 'MESA',
    'SILLA', 'CAMA', 'SOFA', 'VENTANA', 'PUERTA', 'LIBRETA', 'LÁPIZ', 'BOLIGRAFO', 'CEPILLO', 'ESPEJO',
    'PEINE', 'JABÓN', 'TOALLA', 'LAVAVAJILLAS', 'NEVERA', 'LAVADORA', 'COCINA', 'HORNO', 'MICROONDAS', 'TELEVISOR',
    'RADIO', 'CAMARA', 'REPRODUCTOR', 'MOTOR', 'BATERIA', 'CARGADOR', 'CUADERNO', 'GRIFO', 'CORTE', 'PLATO'];
  palabraSeleccionada = '';
  palabraOculta = '';
  vidasCount = 5;
  puntos = 0;
  teclado = document.getElementsByClassName('letter');

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
    });  // Este método se ejecuta cuando el componente se inicializa
  }

  InitGame(){
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
    }
    this.hideButton(letra);
    if(this.ActualizarPalabra()){
      if(this.vidasCount == 0){
        Swal.fire({
          title: `Perdiste\nPuntuacion Final: ${this.puntos}`,
          background: '#000',
          color: '#fff',
          confirmButtonColor: '#ff5722'
          });
        let col = collection(this.firestore, "ahorcado");
        addDoc(col,{puntaje: this.puntos, "user": this.auth.currentUser?.displayName});
        this.vidasCount = 5;
        this.puntos = 0;
        this.InitGame();
      }
      else{
        this.vidasCount = 5;
        this.InitGame();
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
