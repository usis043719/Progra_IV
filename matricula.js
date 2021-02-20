Vue.component('componentmatricula',{
    data:()=>{
        return {
            accion : 'nuevo',
            msg    : '',
            status : false,
            error  : false,
            buscar : "",
            matricula:{
                codigo_matricula : 0,
                periodo : '',
                alumno : '',
                fecha_de_matricula : '',
            },
            matriculas:[]
        }
    },
    methods:{
        buscandoMateria(){
            this.materias = this.materias.filter((element,index,clientes) => element.nombre.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.codigo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
            if( this.buscar.length<=0){
                this.obtenerDatos();
            }
        },
        buscandoAlumno(store){
            let buscarCodigo = new Promise( (resolver,rechazar)=>{
                let index = store.index("codigo"),
                    data = index.get(this.alumno.codigo);
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
                this.matriculas.codigo_matricula = generarIdUnicoDesdeFecha();
                
                let data = await this.codigo_matricula(store);
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
                this.matriculas = data.result;
            };
        },
        mostrarMatricula(pro){
            this.matriculas = pro;
            this.accion='modificar';
        },
        limpiar(){
            this.accion='nuevo';
            this.matricula.periodo='';
            this.matricula.alumno='';
            this.matricula.fecha_de_matricula='';
            this.obtenerDatos();
        },
        eliminarMatricula(pro){
            if( confirm(`Esta seguro que desea eliminar el registro de matricula:  ${pro.descripcion}`) ){
                let store = this.abrirStore("tblmatriculas",'readwrite'),
                    req = store.delete(pro.codigo_matricula);
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
                        <div class="col-sm text-center text-white bg-primary">
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
                            <input v-model="matricula.codigo_matricula" required type="text" class="form-control form-control-sm" >
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm">PERIODO: </div>
                        <div class="col-sm">
                            <input v-model="matricula.periodo" required pattern="[0-9]{4}" type="number" class="form-control form-control-sm">
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm">ALUMNO: </div>
                        <div class="col-sm">
                            <input v-model="matricula.alumno" required pattern="[A-ZÑña-z0-9, ]{5,65}" type="text" class="form-control form-control-sm">
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm">FECHA DE MATRICULA: </div>
                        <div class="col-sm">
                            <input v-model="matricula.fecha_de-matricula" required pattern="{0000-00-00}" type="date" class="form-control form-control-sm" placeholder="Ejem: 0000-00-00">
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
                                            <input v-model="buscar" v-on:keyup="buscandoMateria" type="text" class="form-control form-contro-sm" placeholder="Buscar clientes">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>CODIGO MATRICULA</th>
                                        <th>PERIODO</th>
                                        <th>ALUMNO</th>
                                        <th>FECHA DE MATRICULA</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="pro in matriculas" v-on:click="mostrarMatricula(pro)">
                                        <td>{{ pro.codigo_matricula }}</td>
                                        <td>{{ pro.periodo }}</td>
                                        <td>{{ pro.alumno }}</td>
                                        <td>{{ pro.fecha_de_matricula }}</td>
                                        <td>
                                            <a @click.stop="eliminarMatricula(pro)" class="btn btn-danger">DEL</a>
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