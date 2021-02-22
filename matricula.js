Vue.component('v-select-alumnos', VueSelect.VueSelect);
Vue.component('component-matricula',{
    data:()=>{
        return {
            accion : 'nuevo',
            msg    : '',
            status : false,
            error  : false,
            buscar : "",
            matricula:{
                alumno : {
                    id : 0,
                    label : ''
                },
                idMatricula : 0,
                codigo : '',
                periodo : '',
                fecha_de_matricula : ''
            },
            matricula:[],
            alumnos:[]
        }
    },
    methods:{
        buscandoMatricula(){
            this.matricula = this.matricula.filter((element,index,matricula) => element.codigo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.periodo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
            if( this.buscar.length<=0){
                this.obtenerDatos();
            }
        },
        buscandoCodigoMatricula(store){
            let buscarCodigo = new Promise( (resolver,rechazar)=>{
                let index = store.index("codigo"),
                    data = index.get(this.matricula.codigo);
                data.onsuccess=evt=>{
                    resolver(data);
                };
                data.onerror=evt=>{
                    rechazar(data);
                };
            });
            return buscarCodigo;
        },
        async guardarMatricula(){
            /**
             * webSQL -> DB Relacional en el navegador
             * localStorage -> BD NOSQL clave/valor
             * indexedDB -> BD NOSQL clave/valor
             */
            let store = this.abrirStore("tblmatriculas",'readwrite'),
                duplicado = false;
            if( this.accion=='nuevo' ){
                this.matricula.idMatricula = generarIdUnicoDesdeFecha();
                
                let data = await this.buscandoCodigoMatricula(store);
                duplicado = data.result!=undefined;
            }
            if( duplicado==false){
                let query = store.put(this.matricula);
                query.onsuccess=event=>{
                    this.obtenerDatos();
                    this.limpiar();
                    
                    this.mostrarMsg('Registro se guardo con exito',false);
                };
                query.onerror=event=>{
                    this.mostrarMsg('Error al guardar el registro',true);
                    console.log( event );
                };
            } else{
                this.mostrarMsg('Codigo de matricula duplicado',true);
            }
        },
        mostrarMsg(msg, error){
            this.status = true;
            this.msg = msg;
            this.error = error;
            this.quitarMsg(3);
        },
        quitarMsg(time){
            setTimeout(()=>{
                this.status=false;
                this.msg = '';
                this.error = false;
            }, time*1000);
        },
        obtenerDatos(){
            let store = this.abrirStore('tblmatriculas','readonly'),
                data = store.getAll();
            data.onsuccess=resp=>{
                this.matricula = data.result;
            };
            let storeAlumnos = this.abrirStore('tblalumnos', 'readonly'),
                dataAlumno = storeAlumnos.getAll();
            this.alumnos = [];
            dataAlumno.onsuccess=resp=>{
                dataAlumno.result.forEach(element => {
                    this.alumnos.push({id:element.idAlumno, label:element.nombre});
                });
            };    
        },
        mostrarMatricula(matri){
            this.matricula = matri;
            this.accion='modificar';
        },
        limpiar(){
            this.accion='nuevo';
            this.matricula.alumno.id=0;
            this.matricula.alumno.label="";
            this.matricula.codigo='';
            this.matricula.periodo='';
            this.matricula.fecha_de_matricula='';
            this.obtenerDatos();
        },
        eliminarMatricula(matri){
            if( confirm(`Esta seguro que desea eliminar el registro de matricula:  ${matri.codigo}`) ){
                let store = this.abrirStore("tblmatriculas",'readwrite'),
                    req = store.delete(matri.idMatricula);
                req.onsuccess=resp=>{
                    this.mostrarMsg('Registro eliminado con exito',true);
                    this.obtenerDatos();
                };
                req.onerror=resp=>{
                    this.mostrarMsg('Error al eliminar el registro',true);
                    console.log( resp );
                };
            }
        },
        abrirStore(store,modo){
            let tx = db.transaction(store,modo);
            return tx.objectStore(store);
        }
    },
    created(){
        //this.obtenerDatos();
    },
    template:`
        <form v-on:submit.prevent="guardarMatricula" v-on:reset="limpiar">
            <div class="row">
                <div class="col-sm-5">
                    <div class="row p-2">
                        <div class="col-sm text-center text-white btn-success">
                            <div class="row">
                                <div class="col-11">
                                    <h5>REGISTRO DE MATRICULA</h5>
                                </div>
                                <div class="col-1 align-middle" >
                                    <button type="button" onclick="appVue.forms['matricula'].mostrar=false" class="btn-close" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm">CODIGO MATRICULA:</div>
                        <div class="col-sm">
                            <input v-model="matricula.codigo" required pattern="^[0-9]{4}$" required type="text" class="form-control form-control-sm" placeholder="XXXX">
                        </div>
                    </div>
                    
                    <div class="row p-2">
                        <div class="col-sm">ALUMNO:</div>
                        <div class="col-sm">
                            <v-select-alumnos v-model="matricula.alumno" :options="alumnos" placeholder="Seleccione el nombre del alumno"/>
                        </div>
                    </div>

                    <div class="row p-2">
                        <div class="col-sm">PERIODO: </div>
                        <div class="col-sm">
                            <input v-model="matricula.periodo" required pattern="[0-9]{4}" type="number" class="form-control form-control-sm">
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm">FECHA DE MATRICULA: </div>
                        <div class="col-sm">
                            <input v-model="matricula.fecha_de_matricula" required pattern="{0000-00-00}" type="date" class="form-control form-control-sm" placeholder="Ejem: 0000-00-00">
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm text-center">
                            <input type="submit" value="Guardar" class="btn btn-dark">
                            <input type="reset" value="Limpiar" class="btn btn-warning">
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm text-center">
                            <div v-if="status" class="alert" v-bind:class="[error ? 'alert-danger' : 'alert-success']">
                                {{ msg }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm"></div>
                <div class="col-sm-6 p-2">
                    <div class="row text-center text-white bg-primary">
                        <div class="col"><h5>MATRICULA REGISTRADA</h5></div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <table class="table table-sm table-hover">
                                <thead>
                                    <tr>
                                        <td colspan="5">
                                            <input v-model="buscar" v-on:keyup="buscandoMatricula" type="text" class="form-control form-contro-sm" placeholder="Buscar matricula">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>CODIGO</th>
                                        
                                        <th>ALUMNO</th>
                                        <th>PERIODO</th>
                                        <th>FECHA_DE_MATRICULA</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="matri in matricula" v-on:click="mostrarMatricula(matri)">
                                        <td>{{ matri.codigo}}</td>
                                        <td>{{ matri.alumno.label }}</td>

                                        <td>{{ matri.periodo }}</td>
                                        <td>{{ matri.fecha_de_matricula }}</td>
                                        <td>
                                            <a @click.stop="eliminarMatricula(matri)" class="btn btn-danger">DEL</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    `
});