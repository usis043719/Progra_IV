/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

 require('./bootstrap');

 window.Vue = require('vue').default;
 
 /**
  * The following block of code may be used to automatically register your
  * Vue components. It will recursively scan this directory for the Vue
  * components and automatically register them with their "basename".
  *
  * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
  */
 
 // const files = require.context('./', true, /\.vue$/i)
 // files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))
 
 Vue.component('alumnos-component', require('./components/alumnos.vue').default);
 
 /**
  * Next, we will create a fresh Vue application instance and attach it to
  * the page. Then, you may begin adding components to this application
  * or customize the JavaScript scaffolding to fit your unique needs.
  */
 
 const app = new Vue({
     el: '#app',
     methods:{
         abrirBd(){
             let indexDb = indexedDB.open('db_registro_de_alumnos',1);
             indexDb.onupgradeneeded=event=>{
                 let req=event.target.result,
                     tblalumnos = req.createObjectStore('tblalumnos',{keyPath:'idAlumno'});
                     tblmatriculas = req.createObjectStore('tblmatriculas',{keyPath:'idMatricula'});
                     tblinscripciones= req.createObjectStore('tblinscripciones',{keyPath:'idInscripcion'});
 
 
 
                 tblalumnos.createIndex('idAlumno','idAlumno',{unique:true});
                 tblalumnos.createIndex('codigo','codigo',{unique:false});
                 tblalumnos.createIndex('id','id',{unique:false});
 
                 tblmatriculas.createIndex('idMatricula','idMatricula',{unique:true});
                 tblmatriculas.createIndex('codigo','codigo',{unique:false});
 
                 tblinscripciones.createIndex('idInscripcion','idInscripcion',{unique:true});
                 tblinscripciones.createIndex('codigo','codigo',{unique:false});
 
 
 
 
             };
             indexDb.onsuccess = evt=>{
                 db=evt.target.result;
             };
             indexDb.onerror=e=>{
                 console.log("Error al conectar a la BD", e);
             };
         }
     },
     created(){
         this.abrirBd();
     }
 });
 
 document.addEventListener("DOMContentLoaded",event=>{
     let el = document.querySelectorAll(".mostrar").forEach( (element, index)=>{
         element.addEventListener("click",evt=>{
             appVue.forms[evt.target.dataset.form].mostrar = true;
             appVue.$refs[evt.target.dataset.form].obtenerDatos();
         });
     } );
 });