    Vue.component('component-inscripcion',{
        data:()=>{
            return {
                accion : 'nuevo',
                msg    : '',
                status : false,
                error  : false,
                buscar : "",
                inscripcion:{
                    idInscripcion : 0,
                    codigo : '',
                    alumno : '',
                    Materia : '',
                    fecha_de_inscripcion : '',
                },
                inscripciones:[]
            }
        },
        methods:{
            buscandoInscripcion(){
                this.inscripciones = this.inscripciones.filter((element,index,inscripciones) => element.alumno.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.codigo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
                if( this.buscar.length<=0){
                    this.obtenerDatos();
                }
            },
            buscandoCodigoInscripcion(store){
                let buscarCodigo = new Promise( (resolver,rechazar)=>{
                    let index = store.index("codigo"),
                        data = index.get(this.inscripcion.codigo);
                    data.onsuccess=evt=>{
                        resolver(data);
                    };
                    data.onerror=evt=>{
                        rechazar(data);
                    };
                });
                return buscarCodigo;
            },
            async guardarInscripcion(){
                /**
                
                 * indexedDB -> BD NOSQL clave/valor
                 */
                let store = this.abrirStore("tblinscripciones",'readwrite'),
                    duplicado = false;
                if( this.accion=='nuevo' ){
                    this.inscripcion.idInscripcion = generarIdUnicoDesdeFecha();
                    
                    let data = await this.buscandoCodigoInscripcion(store);
                    duplicado = data.result!=undefined;
                }
                if( duplicado==false){
                    let query = store.put(this.inscripcion);
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
                    this.mostrarMsg('Codigo de inscripcion duplicado',true);
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
                let store = this.abrirStore('tblinscripciones','readonly'),
                    data = store.getAll();
                data.onsuccess=resp=>{
                    this.inscripciones = data.result;
                };
            },
            mostrarInscripcion(pro){
                this.inscripcion = pro;
                this.accion='modificar';
            },
            limpiar(){
                this.accion='nuevo';
                this.inscripcion.idInscripcion='';
                this.inscripcion.codigo='';
                this.inscripcion.alumno='';
                this.inscripcion.materia='';
                this.inscripcion.fecha_de_inscripcion='';
                this.obtenerDatos();
            },
            eliminarInscripcion(pro){
                if( confirm(`Esta seguro que desea eliminar el registro de inscripcion:  ${pro.alumno}`) ){
                    let store = this.abrirStore("tblinscripciones",'readwrite'),
                        req = store.delete(pro.idInscripcion);
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
            <form v-on:submit.prevent="guardarInscripcion" v-on:reset="limpiar">
                <div class="row">
                    <div class="col-sm-5">
                        <div class="row p-2">
                            <div class="col-sm text-center text-white btn-success">
                                <div class="row">
                                    <div class="col-11">
                                        <h5>REGISTRO DE INSCRIPCION</h5>
                                        </div>
                                        <div class="col-1 align-middle" >
                                            <button type="button" onclick="appVue.forms['inscripcion'].mostrar=false" class="btn-close" aria-label="Close"></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row p-2">
                            <div class="col-sm">CODIGO: </div>
                            <div class="col-sm">
                                <input v-model="inscripcion.codigo" required pattern="[0-9]{4}" type="number" class="form-control form-control-sm" placeholder="XXXX">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm">ALUMNO: </div>
                            <div class="col-sm">
                                <input v-model="inscripcion.alumno" required pattern="[A-ZÑña-z0-9, ]{5,65}" type="text" class="form-control form-control-sm" placeholder="XXXX XXXX XXXX XXXX">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm">MATERIAS: </div>
                            <div class="col-sm">
                                <input v-model="inscripcion.materia" required pattern="[0-9]{4}" type="number" class="form-control form-control-sm" >
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm">FECHA_DE_INSCRIPCION: </div>
                            <div class="col-sm">
                                <input v-model="inscripcion.fecha_de_inscripcion" required pattern="{0000-00-00}" type="date" class="form-control form-control-sm" placeholder="Ejem: 0000-00-00">
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
                            <div class="col"><h5>INSCRIPCION REGISTRADA</h5></div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <table class="table table-sm table-hover">
                                    <thead>
                                        <tr>
                                            <td colspan="5">
                                                <input v-model="buscar" v-on:keyup="buscandoInscripcion" type="text" class="form-control form-contro-sm" placeholder="Buscar Inscripcion">
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>CODIGO</th>
                                            <th>ALUMNO</th>
                                            <th>MATERIA</th>
                                            <th>FECHA_DE_INSCRIPCION</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="pro in inscripciones" v-on:click="mostrarInscripcion(pro)">
                                           <td>{{ pro.codigo }}</td>
                                            <td>{{ pro.alumno }}</td>
                                            <td>{{ pro.materia }}</td>
                                            <td>{{ pro.fecha_de_inscripcion }}</td>
                                            <td>
                                                <a @click.stop="eliminarInscripcion(pro)" class="btn btn-danger">DEL</a>
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