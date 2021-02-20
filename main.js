var generarIdUnicoDesdeFecha=()=>{
    let fecha = new Date();//03/02/2021
    return Math.floor(fecha.getTime()/1000).toString(16);
}, db;
var appVue = new Vue({
    el:'#appSistema',
    data:{
        forms:{
            'alumno':{mostrar:false},
            'matricula':{mostrar:false},

            
        }
    },
    methods:{
        abrirBd(){
            let indexDb = indexedDB.open('db_registro_de_alumnos',1);
            indexDb.onupgradeneeded=event=>{
                let req=event.target.result,
                    tblalumnos = req.createObjectStore('tblalumnos',{keyPath:'idAlumno'});
                    tblmatriculas = req.createObjectStore('tblmatriculas',{keyPath:'codigo_matricula'});



                tblalumnos.createIndex('idAlumno','idAlumno',{unique:true});
                tblalumnos.createIndex('codigo','codigo',{unique:false});

                tblmatriculas.createIndex('codigo_matricula','codigo_matricula',{unique:true});
                tblmatriculas.createIndex('periodo','periodo',{unique:false});




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