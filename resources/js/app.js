/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

 require('./bootstrap');

 window.Vue = require('vue');
 window.Vue = require('vue').default;
window.db = '';
window.generarIdUnicoDesdeFecha=()=>{
    let fecha = new Date();//03/02/2021
    return Math.floor(fecha.getTime()/1000).toString(16);
};


window.socket = io.connect('http://localhost:3001',{'forceNew':true});

 /**
  * The following block of code may be used to automatically register your
  * Vue components. It will recursively scan this directory for the Vue
  * components and automatically register them with their "basename".
  *
  * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
  */
 
 // const files = require.context('./', true, /\.vue$/i)
 // files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))
 
 Vue.component('inscripciones-component', require('./components/inscripciones.vue').default);
 Vue.component('chat-component', require('./components/chat.vue').default);
Vue.component('v-select-categorias', vSelect)
 /**
  * Next, we will create a fresh Vue application instance and attach it to
  * the page. Then, you may begin adding components to this application
  * or customize the JavaScript scaffolding to fit your unique needs.
  */
 
  const app = new Vue({
    el: '#app',
    data:{
        forms:{
        
            'inscripcion':{mostrar:false},
            'chat':{mostrar:false},
    
        }
    },
    methods:{
        abrirForm(form){
            this.forms[form].mostrar=true;
            this.$refs[form].obtenerDatos();
        },
        abrirBd(){
            let indexDb = indexedDB.open('db_alimento_saludable',1);
            indexDb.onupgradeneeded=event=>{
                let req=event.target.result,
                    tblinscripciones = req.createObjectStore('tblinscripciones',{keyPath:'idInscripcion'});


                tblinscripciones.createIndex('idInscripcion','idInscripcion',{unique:true});
                tblinscripciones.createIndex('codigo','codigo',{unique:false});
                tblinscripciones.createIndex('id','id',{unique:false});

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
    },
});