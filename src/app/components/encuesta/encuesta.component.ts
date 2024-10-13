import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.scss'
})


export class EncuestaComponent {
  form!: FormGroup;
  formularioEnviado: boolean = false;

  constructor(public auth: Auth, private firestore: Firestore) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      nombre: new FormControl("", [Validators.pattern('^[a-zA-Z]+$'),Validators.required]),
      apellido: new FormControl("", [Validators.pattern('^[a-zA-Z]+$'),Validators.required]),
      edad: new FormControl("",[Validators.min(18),Validators.max(99),Validators.required]),
      telefono: new FormControl("",[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern('^[0-9]+$')]),
      sugerencia: new FormControl("", Validators.required),
      ahorcado: new FormControl(false),
      mayorOmenor: new FormControl(false),
      preguntas: new FormControl(false),
      simonDice: new FormControl(false),
      recomendar: new FormControl('si')
    }, [this.validarAlMenosunCheckbox]);
  }

  validarAlMenosunCheckbox(control: AbstractControl){
    const group = control as FormGroup;
    const checkboxes = [
    group.get('ahorcado')?.value,
    group.get('mayorOmenor')?.value,
    group.get('preguntas')?.value,
    group.get('simonDice')?.value
    ];
    const isAnySelected = checkboxes.some(value => value === true);
    return isAnySelected ? null : { noCheckboxSelected: "Seleccione al menos una opcion" };
  }

  async enviar(){
    this.formularioEnviado = true;
    if(this.form.valid){
      try {
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
        const col = collection(this.firestore, "encuesta");
        const formData ={
          ...this.form.value,
          usuario: this.auth.currentUser?.displayName,
          fecha: new Date()
        }
        await addDoc(col, formData);
        console.log('Documento agregado exitosamente!');
        this.form.reset({
          nombre: '',
          edad: '',
          apellido: '',
          telefono: '',
          sugerencia:'',
          recomendar: 'si'
        });
        Swal.close()
        Swal.fire({
          title: `La encuesta fue cargada con exito`,
          background: '#000',
          color: '#fff',
          confirmButtonColor: '#ff5722'
          })
      } catch (error) {
        console.error('Error al agregar documento: ', error);
      }
      console.log("Se envio el formulario");
      this.formularioEnviado = false;
    }
  }

  get nombre() {
    return this.form.get('nombre');
  }
  get apellido() {
    return this.form.get('apellido');
  }
  get edad() {
    return this.form.get('edad');
  }
  get telefono() {
    return this.form.get('telefono');
  }
  get sugerencia() {
    return this.form.get('sugerencia');
  }
  get ahorcado() {
    return this.form.get('ahorcado');
  }
  get mayorOmenor() {
    return this.form.get('mayorOmenor');
  }
  get preguntas() {
    return this.form.get('preguntas');
  }
  get simonDice() {
    return this.form.get('simonDice');
  }
  get recomendar(){
    return this.form.get('recomendar');
  }
}
