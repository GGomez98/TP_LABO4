import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AhorcadoComponent } from './componentes/ahorcado/ahorcado.component';
import { MayorOMenorComponent } from './componentes/mayor-o-menor/mayor-o-menor.component';
import { PreguntasComponent } from './componentes/preguntas/preguntas.component';
import { InvasoresComponent } from './componentes/invasores/invasores.component';

const routes: Routes = [
  {
    path:'ahorcado',
    component:AhorcadoComponent
  },
  {
    path:'mayor-o-menor',
    component:MayorOMenorComponent
  },
  {
    path:'preguntas',
    component:PreguntasComponent
  },
  {
    path:'invasores',
    component:InvasoresComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }
