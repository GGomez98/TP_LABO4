import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JuegosRoutingModule } from './juegos-routing.module';
import { AhorcadoComponent } from './componentes/ahorcado/ahorcado.component';
import { MayorOMenorComponent } from './componentes/mayor-o-menor/mayor-o-menor.component';
import { PreguntasComponent } from './componentes/preguntas/preguntas.component';
import { BuscaminasComponent } from './componentes/buscaminas/buscaminas.component';
import { JuegoComponent } from './componentes/juego/juego.component';
import { RouterLink } from '@angular/router';


@NgModule({
  declarations: [
    AhorcadoComponent, MayorOMenorComponent, PreguntasComponent, BuscaminasComponent, JuegoComponent
  ],
  exports:[
    AhorcadoComponent, MayorOMenorComponent, PreguntasComponent, BuscaminasComponent
  ],
  imports: [
    CommonModule,
    JuegosRoutingModule
  ]
})
export class JuegosModule { }
