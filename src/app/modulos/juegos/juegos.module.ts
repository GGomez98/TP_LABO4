import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JuegosRoutingModule } from './juegos-routing.module';
import { AhorcadoComponent } from './componentes/ahorcado/ahorcado.component';
import { MayorOMenorComponent } from './componentes/mayor-o-menor/mayor-o-menor.component';
import { PreguntasComponent } from './componentes/preguntas/preguntas.component';
import { JuegoComponent } from './componentes/juego/juego.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {  SimonDiceComponent } from './componentes/simon-dice/simon-dice.component';


@NgModule({
  declarations: [
    AhorcadoComponent, MayorOMenorComponent, PreguntasComponent, SimonDiceComponent, JuegoComponent
  ],
  exports:[
    AhorcadoComponent, MayorOMenorComponent, PreguntasComponent, SimonDiceComponent
  ],
  imports: [
    CommonModule,
    JuegosRoutingModule,
    FormsModule
  ]
})
export class JuegosModule { }
