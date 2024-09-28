import { Component } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { PaisesService } from '../../../../servicios/paises.service';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preguntas',
  standalone: false,
  templateUrl: './preguntas.component.html',
  styleUrl: './preguntas.component.scss'
})
export class PreguntasComponent {
  subscription!:Subscription;
  paises: any;
  listaPaises: any[] = [];
  opciones:any[] = [];
  paisSeleccionado:any;
  dataCargada = false;
  puntaje = 0;
  vidasCount = 3;
  elementosOpciones = document.getElementsByClassName('opciones');

  constructor(private clubesService: PaisesService,private firestore: Firestore, protected auth: Auth){}

  ngOnInit():void{
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
    this.subscription = this.clubesService.getPaises()
    .subscribe(
      paises => {
        this.paises = paises;
        let id = 1;
        this.paises.forEach((pais: any) => {
          this.listaPaises.push({"id":id,"nombre":pais.translations.spa.common,"bandera":pais.flags.png})
          id++;
        });
        console.log(this.listaPaises);
        this.elegirPais();
        this.cargarOpciones();
        this.dataCargada = true;
        Swal.close();
        Swal.fire({
          title: `Preguntas`,
          html:`<div style="text-align: left;">
          -Al jugador se le muestra una bandera y tiene 3 opciones para elegir<br><br>
          -Por cada acierto suma un punto y por cada respuesta incorrecta pierde una vida<br><br>
          -El juego finaliza cuando el jugador pierde sus 3 vidas<br><br>
          </div>`,
          background: '#000',
          color: '#fff',
          confirmButtonColor: '#ff5722',
          confirmButtonText:"Entendido",
          allowOutsideClick: false,
          allowEscapeKey: false 
        });
      });
  }

  elegirPais(){
    let index = Math.floor(Math.random()*this.listaPaises.length);
    this.paisSeleccionado = this.listaPaises[index];
    console.log(this.paisSeleccionado);
  }

  cargarOpciones(){
    this.opciones.push(this.paisSeleccionado);

    while(this.opciones.length<3){
      let index = Math.floor(Math.random()*this.listaPaises.length);
      let opcion = this.listaPaises[index];
      if(!this.opciones.includes(opcion)){
        this.opciones.push(opcion);
      }
    }

    this.opciones = this.opciones.sort(function() { return Math.random() - 0.5 });

    console.log(this.opciones);
  }

  elegirOpcion(idOpcion:string){
    let opcionCorrecta = document.getElementById(this.paisSeleccionado.id)

    for (let i = 0; i < this.elementosOpciones.length; i++) {
      let buttonId = this.elementosOpciones[i].id;
      let button = document.getElementById(buttonId);
      if(button!=null && button instanceof HTMLButtonElement){
        button.disabled = true;
        button.style.backgroundColor = 'rgba(91, 91, 91, 0.8)';
      }
    }

    if(idOpcion == this.paisSeleccionado.id && opcionCorrecta != null){
      opcionCorrecta.style.backgroundColor = "rgba(1, 137, 12, 0.8)"
      this.puntaje++;
    }
    else if(opcionCorrecta != null){
      let opcionIncorrecta = document.getElementById(idOpcion);
      if(opcionIncorrecta != null){
        opcionCorrecta.style.backgroundColor = "rgba(1, 137, 12, 0.8)"
        opcionIncorrecta.style.backgroundColor = "rgba(153, 6, 6, 0.8)"
      }
      this.vidasCount--;
    }

    setTimeout(() => {
      for (let i = 0; i < this.elementosOpciones.length; i++) {
        let buttonId = this.elementosOpciones[i].id;
        let button = document.getElementById(buttonId);
        if(button!=null && button instanceof HTMLButtonElement){
          button.disabled = false;
        }
      }
      if(idOpcion == this.paisSeleccionado.id && opcionCorrecta != null){
        opcionCorrecta.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
      }
      else if(opcionCorrecta != null){
        let opcionIncorrecta = document.getElementById(idOpcion);
        if(opcionIncorrecta != null){
          opcionCorrecta.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
          opcionIncorrecta.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
        }
      }

      if(this.vidasCount == 0){
        Swal.fire({
          title: `Perdiste\nPuntuacion Final: ${this.puntaje}`,
          background: '#000',
          color: '#fff',
          confirmButtonColor: '#ff5722',
          confirmButtonText: "Reiniciar Juego"
          }).then((result) => {
            if (result.isConfirmed) {
              let col = collection(this.firestore, "preguntas");
              addDoc(col,{puntaje: this.puntaje, "user": this.auth.currentUser?.displayName});
              this.vidasCount = 3;
              this.puntaje = 0;
              this.opciones = [];
              this.elegirPais();
              this.cargarOpciones();
            }
          });
      }
      else{
        this.opciones = [];
        this.elegirPais();
        this.cargarOpciones();
      }
    }, 2500);
  }

  get vidas(): number[] {
    return Array(this.vidasCount).fill(0).map((_, index) => index);
  }

}
